import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import * as path from 'path';

export class CustomerApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Lambda function
    const customerLambda = new lambda.Function(this, 'CustomerApiFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../src')),
      functionName: 'customer-api-handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      description: 'Customer API Lambda Function',
    });

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'CustomerApi', {
      restApiName: 'Customer API Service',
      description: 'API Gateway for Customer Data Explorer',
      deployOptions: {
        stageName: 'prod',
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
        metricsEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: [
          'Content-Type',
          'X-Amz-Date',
          'Authorization',
          'X-Api-Key',
          'X-Amz-Security-Token',
        ],
      },
    });

    // Create /customers resource
    const customers = api.root.addResource('customers');
    
    // Add GET method to /customers
    const integration = new apigateway.LambdaIntegration(customerLambda, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
      proxy: true,
    });

    customers.addMethod('GET', integration, {
      apiKeyRequired: false,
      requestParameters: {
        'method.request.querystring.start': true,
        'method.request.querystring.max': true,
      },
    });

    // Output the API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'Customer API Gateway URL',
      exportName: 'CustomerApiUrl',
    });

    // Output the Lambda ARN
    new cdk.CfnOutput(this, 'LambdaArn', {
      value: customerLambda.functionArn,
      description: 'Customer Lambda Function ARN',
      exportName: 'CustomerLambdaArn',
    });
  }
}
