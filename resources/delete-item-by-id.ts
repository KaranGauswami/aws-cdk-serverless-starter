import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient, } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DeleteCommandInput, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


export async function main(
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
    console.log('event 👉', event);

    try {

        let key = event.pathParameters?.id;
        if (!key) {
            return {
                statusCode: 400,
                body: JSON.stringify({})
            }
        }
        const params = {
            TableName: process.env.DB_TABLE_NAME,
            Key: {
                Id: key
            }
        } satisfies DeleteCommandInput;

        await ddbDocClient.send(new DeleteCommand(params));

        return {
            statusCode: 204,
        };
    } catch (e) {

        return {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ message: "Internal Server Error" }),
            statusCode: 500,
        };

    }
}
