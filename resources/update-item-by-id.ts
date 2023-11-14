import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { DynamoDBClient, } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);


export async function main(
    event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
    console.log('event 👉', event);

    let body: any;
    let Name: string | undefined;
    let Key: string | undefined;
    try {
        body = JSON.parse(event.body || '')
        Name = body.Name;
        Key = event.pathParameters?.id;
        if (!Key) {
            throw new Error("Id is required in path")
        }
        if (!Name) {
            throw new Error("Name is required")
        }
    } catch (e) {
        if (e instanceof Error) {
            return {
                headers: {
                    'content-type': 'application/json'
                },
                statusCode: 400,
                body: JSON.stringify({
                    message: e.message
                })
            }
        } else {
            throw new Error("Internal Error")
        }
    }

    try {

        const foundItem = await ddbDocClient.send(new GetCommand({ TableName: process.env.DB_TABLE_NAME, Key: { Id: Key } }))
        if (!foundItem.Item) {

            return {
                headers: {
                    'content-type': 'application/json'
                },
                statusCode: 404,
                body: JSON.stringify({
                    message: "Not found"
                })
            }
        }

        let item = {
            Id: foundItem.Item.Id,
            Name,
        }
        const params = {
            TableName: process.env.DB_TABLE_NAME,
            Item: item
        } satisfies PutCommandInput;

        await ddbDocClient.send(new PutCommand(params));

        return {
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ item }),
            statusCode: 201,
        };
    } catch (e) {

        return {
            headers: {
                'content-type': 'application/json'
            },
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        }
    }
}
