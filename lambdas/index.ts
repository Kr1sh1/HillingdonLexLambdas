import { Handler, SQSEvent } from 'aws-lambda';
import { SNSClient, PublishCommand, PublishCommandInput } from '@aws-sdk/client-sns';
import { OrderRecyclingBags, Task } from './types';
import { makeServerConfig, uploadToConnectCallIssue, uploadToIssueAddress, uploadToIssues } from './database';
import { connect } from 'mssql';

const snsClient = new SNSClient({ region: 'eu-west-2' });

function publish(Message: string, PhoneNumber: string) {
  const params: PublishCommandInput = { Message, PhoneNumber }
  const publishCommand = new PublishCommand(params);
  return snsClient.send(publishCommand);
}

function makeAddressString(task: OrderRecyclingBags) {
  const address = task.taskParameters.address
  return `${address.house_number}, ${address.street_name}, ${address.post_code}`
}

export const handler: Handler<SQSEvent> = async (event, context) => {
  const serverConfig = makeServerConfig()
  const pool = await connect(serverConfig)
  let publishes = [];
  let uploads = []

  for (const message of event.Records) {
    const task: Task = JSON.parse(message.body)

    switch (task.taskName) {
      case "OrderRecyclingBag":
        const address = makeAddressString(task)

        const initial = uploadToIssues(pool.request(), task)
        uploads.push(
          initial.then(issueID => uploadToIssueAddress(pool.request(), issueID, address)),
          initial.then(issueID => uploadToConnectCallIssue(pool.request(), issueID, task.callSid))
        )
        
        if (task.phoneNumber !== "anonymous")
          publishes.push(
            publish(
            `Your order for recycling bags has been processed and will be delivered to ${address}`,
            task.phoneNumber
          ))
        break;
    }
  }
  await Promise.all([...publishes, ...uploads]);
  await pool.close()
  return;
};