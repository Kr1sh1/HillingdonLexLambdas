import { Request, TYPES, config } from "mssql"
import { SQLParams, Task } from "./types"

function constructRequest(request: Request, params: SQLParams) {
  const fieldNames = params.map((param) => param.fieldName)

  const columns = fieldNames.join(", ")
  const values = "@" + fieldNames.join(", @")
  const builtRequest = params.reduce((req, param) => req.input(param.fieldName, param.type, param.value), request)

  return { columns, values, builtRequest }
}

export function makeServerConfig() {
  return {
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    server: process.env.RDS_SERVER,
    port: +(process.env.RDS_PORT as string),
    database: process.env.RDS_DATABASE,
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  } as config
}

function makeSQLParamsIssues(taskName: string) {
  return [
    {
      fieldName: "TypeName",
      value: taskName,
      type: TYPES.VarChar
    },
  ] as SQLParams
}

function makeSQLParamsIssueAddress(issueID: number, address: string) {
  return [
    {
      fieldName: "IssueID",
      value: issueID,
      type: TYPES.Int
    },
    {
      fieldName: "Address",
      value: address,
      type: TYPES.VarChar
    },
    {
      fieldName: "IsApproximate",
      value: 0,
      type: TYPES.Bit
    },
  ] as SQLParams
}

function makeSQLParamsConnectCallIssue(issueID: number, callSid: string) {
  return [
    {
      fieldName: "CallID",
      value: callSid,
      type: TYPES.VarChar
    },
    {
      fieldName: "IssueID",
      value: issueID,
      type: TYPES.Int
    },
  ] as SQLParams
}

export function uploadToIssues(req: Request, task: Task) {
  const issuesInsertParams = makeSQLParamsIssues(task.taskName)
  const { columns, values, builtRequest } = constructRequest(req, issuesInsertParams)
  
  const sqlQuery = `
    INSERT INTO Issues (${columns})
    OUTPUT INSERTED.IssueID
    VALUES (${values})
    `

  return builtRequest
    .query(sqlQuery)
    .then(x => x.recordset[0]["IssueID"])
}

export function uploadToIssueAddress(req: Request, issueID: number, address: string) {
  const issueAddressInsertParams = makeSQLParamsIssueAddress(issueID, address)
  const { columns, values, builtRequest } = constructRequest(req, issueAddressInsertParams)
  
  const sqlQuery = `
    INSERT INTO IssueAddress (${columns})
    VALUES (${values})
    `

  return builtRequest
    .query(sqlQuery)
    .then(x => x.output["IssueID"])
}

export function uploadToConnectCallIssue(req: Request, issueID: number, callSid: string) {
  const connectCallIssueInsertParams = makeSQLParamsConnectCallIssue(issueID, callSid)
  const { columns, values, builtRequest } = constructRequest(req, connectCallIssueInsertParams)
  
  const sqlQuery = `
    INSERT INTO ConnectCallIssue (${columns})
    VALUES (${values})
    `

  return builtRequest
    .query(sqlQuery)
    .then(x => x.output["IssueID"])
}
