# HillingdonLexLambdas

This repository contains code for the singular Lambda function that was developed by Team Engelbart.

The Lambda function acts as a consumer for events from Amazon Simple Queue Service. These events are tasks which have been generated during a phone call with our HillingdonLex assistant. The Lambda writes the task information into our relational database and sends an sms update to the callers phone number, if available.

## Project Structure
## Getting Started

### Installation

The project uses external dependencies, all of which can be installed onto your local machine by running the following command from the root of the repository:

```console
user@computer:~$ npm install
```

Create a .env file with any environment variables required.

## How CI/CD works in this repository

Just run the following to deploy:

```console
user@computer:~$ npm run deploy
```

And to update the environment variables of a function, run:

```console
user@computer:~$ npm run envUpdate
```
