import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction, OutputFormat } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { CfnOutput } from 'aws-cdk-lib';

import { HttpLambdaIntegration, } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

import * as  apigwv2 from '@aws-cdk/aws-apigatewayv2-alpha'


export class SampleAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Create DynamoDB table
    const table = new dynamodb.TableV2(this, 'ItemTable', {
      partitionKey: { name: 'Id', type: dynamodb.AttributeType.STRING },
    });


    // Get all items
    const getItemsFn = new NodejsFunction(this, 'GetItems', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "main",
      entry: `resources/get-items.ts`,
      bundling: {
        format: OutputFormat.ESM
      },
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });

    // Get Item by Id
    const getItemByIdFn = new NodejsFunction(this, 'GetItemById', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "main",
      entry: `resources/get-item-by-id.ts`,
      bundling: {
        format: OutputFormat.ESM
      },
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });

    // Update Item by Id
    const updateItemByIdFn = new NodejsFunction(this, 'UpdateItemById', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "main",
      entry: `resources/update-item-by-id.ts`,
      bundling: {
        format: OutputFormat.ESM
      },
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });

    // Creat Item
    const createItemFn = new NodejsFunction(this, 'CreateItem', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "main",
      entry: `resources/create-item.ts`,
      bundling: {
        format: OutputFormat.ESM
      },
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });

    // Delete Item
    const deleteItemFn = new NodejsFunction(this, 'DeleteItemById', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "main",
      entry: `resources/delete-item-by-id.ts`,
      bundling: {
        format: OutputFormat.ESM
      },
      environment: {
        DB_TABLE_NAME: table.tableName
      }
    });

    const httpApi = new apigwv2.HttpApi(this, "ItemsApi")


    let routes = [
      {

        path: '/items',
        methods: [apigwv2.HttpMethod.GET],
        integration: new HttpLambdaIntegration('get-all-items-integration', getItemsFn),
      },
      {
        path: '/items/{id}',
        methods: [apigwv2.HttpMethod.GET],
        integration: new HttpLambdaIntegration('get-items-by-id-integration', getItemByIdFn),
      },
      {
        path: '/items',
        methods: [apigwv2.HttpMethod.POST],
        integration: new HttpLambdaIntegration('create-item-integration', createItemFn),
      },
      {
        path: '/items/{id}',
        methods: [apigwv2.HttpMethod.DELETE],
        integration: new HttpLambdaIntegration('delete-item-integration', deleteItemFn),
      },
      {
        path: '/items/{id}',
        methods: [apigwv2.HttpMethod.PUT],
        integration: new HttpLambdaIntegration('update-item-integration', updateItemByIdFn),
      }
    ] satisfies apigwv2.AddRoutesOptions[];
    routes.forEach((route) => httpApi.addRoutes(route))


    // DynamoDB allow permissions for Lambda
    table.grantReadData(getItemsFn);
    table.grantReadData(getItemByIdFn);

    table.grantWriteData(createItemFn);

    table.grantReadWriteData(deleteItemFn);
    table.grantReadWriteData(updateItemByIdFn);

    // Outputs 

    // API Endpoints
    new CfnOutput(this, "ApiEndpointUrl", { value: httpApi.apiEndpoint })


  }
}
