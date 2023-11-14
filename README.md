# aws-cdk-serverless-starter

A Simple CDK CRUD application with AWS Lambda , API Gateway V2 and DynamoDB

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Getting Started

Getting Started
Clone the repository.

```bash
git clone https://github.com/KaranGauswami/aws-cdk-serverless-starter.git
```

Install the dependencies:

```bash
yarn install --frozen-lockfile
```

Deploy the Stack:

```bash
yarn cdk deploy
```

The output should resemble the following:

```
Outputs:
SampleAppStack.ApiEndpointUrl = https://h5iqvrqog7.execute-api.ap-south-1.amazonaws.com
```

Create an Item Using API:

```bash
curl --location '{ApiEndpointUrl}/items' --header 'Content-Type: application/json' --data '{"Name": "First Item"}'
```

Get All Items Using API:

```bash
curl --location '{ApiEndpointUrl}/items'
```

Make sure to replace {ApiEndpointUrl} with the actual API endpoint URL provided during the stack deployment.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
