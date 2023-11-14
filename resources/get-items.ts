import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient, } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommandInput, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


export async function main(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  console.log('event 👉', event);

  try {

    const params = {
      TableName: process.env.DB_TABLE_NAME,
    } satisfies ScanCommandInput;

    const data = await ddbDocClient.send(new ScanCommand(params));

    let items = data.Items || [];
    items.forEach((item) => {
      item._link = `/items/${item.Id}`
    })

    return {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ items }),
      statusCode: 200,
    };
  } catch (e) {
    return {
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({ message: "Internal Server Error" }),
      statusCode: 500,
    }
  }
}
