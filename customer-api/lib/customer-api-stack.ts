import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class CustomerApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'CustomerApiVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          name: 'private-isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
        },
      ],
    });

    const lambdaSecurityGroup = new ec2.SecurityGroup(this, 'CustomerLambdaSg', {
      vpc,
      description: 'Security group for customer API Lambda',
      allowAllOutbound: true,
    });

    const databaseSecurityGroup = new ec2.SecurityGroup(this, 'CustomerDatabaseSg', {
      vpc,
      description: 'Security group for customer API RDS database',
      allowAllOutbound: true,
    });

    databaseSecurityGroup.addIngressRule(
      lambdaSecurityGroup,
      ec2.Port.tcp(5432),
      'Allow Lambda access to PostgreSQL',
    );

    const database = new rds.DatabaseInstance(this, 'CustomerDatabase', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_16_4,
      }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MICRO),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      credentials: rds.Credentials.fromGeneratedSecret('customer_api_user'),
      databaseName: 'customerdb',
      allocatedStorage: 20,
      maxAllocatedStorage: 100,
      multiAz: false,
      publiclyAccessible: false,
      securityGroups: [databaseSecurityGroup],
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda function
    const customerLambda = new lambda.Function(this, 'CustomerApiFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'main.handler',
      code: lambda.Code.fromAsset('src'),
      functionName: 'customer-api-handler',
      timeout: cdk.Duration.seconds(30),
      memorySize: 512,
      environment: {
        NODE_ENV: 'production',
        LOG_LEVEL: 'info',
        DB_HOST: database.instanceEndpoint.hostname,
        DB_PORT: database.instanceEndpoint.port.toString(),
        DB_NAME: 'customerdb',
        DB_SECRET_ARN: database.secret?.secretArn ?? '',
      },
      logRetention: logs.RetentionDays.ONE_WEEK,
      description: 'Customer API Lambda Function',
      vpc,
      securityGroups: [lambdaSecurityGroup],
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    if (database.secret) {
      database.secret.grantRead(customerLambda);
    }

    // Create API Gateway
    // TODO: consider lambda authorizer for better security.
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

    new cdk.CfnOutput(this, 'DatabaseEndpoint', {
      value: database.instanceEndpoint.hostname,
      description: 'RDS endpoint hostname',
      exportName: 'CustomerDatabaseEndpoint',
    });

    new cdk.CfnOutput(this, 'DatabasePort', {
      value: database.instanceEndpoint.port.toString(),
      description: 'RDS endpoint port',
      exportName: 'CustomerDatabasePort',
    });

    // Export Swagger/OpenAPI spec
    new cdk.CfnOutput(this, 'SwaggerSpecUrl', {
      value: `${api.url}swagger.json`,
      description: 'Swagger/OpenAPI specification URL',
      exportName: 'CustomerApiSwaggerSpec',
    });

    // Export Swagger spec as JSON
    const swaggerSpec = {
      openapi: '3.0.0',
      info: {
        title: 'Customer API',
        description: 'API for Customer Data Explorer',
        version: '1.0.0',
      },
      servers: [
        {
          url: api.url,
          description: 'Production API',
        },
      ],
      paths: {
        '/customers': {
          get: {
            summary: 'List customers',
            description: 'Retrieve a paginated list of customers',
            parameters: [
              {
                name: 'start',
                in: 'query',
                required: true,
                schema: {
                  type: 'integer',
                  default: 0,
                },
                description: 'Starting index for pagination',
              },
              {
                name: 'max',
                in: 'query',
                required: true,
                schema: {
                  type: 'integer',
                  default: 10,
                },
                description: 'Maximum number of customers to return',
              },
            ],
            responses: {
              200: {
                description: 'Successful response with customer list',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        customers: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              customerId: { type: 'string' },
                              firstName: { type: 'string' },
                              lastName: { type: 'string' },
                              email: { type: 'string' },
                            },
                          },
                        },
                        totalCustomers: { type: 'integer' },
                      },
                    },
                  },
                },
              },
              400: {
                description: 'Bad request - invalid parameters',
              },
              500: {
                description: 'Internal server error',
              },
            },
          },
        },
      },
    };

    new cdk.CfnOutput(this, 'SwaggerSpecJson', {
      value: JSON.stringify(swaggerSpec),
      description: 'Swagger/OpenAPI specification JSON',
      exportName: 'CustomerApiSwaggerSpecJson',
    });
  }
}
