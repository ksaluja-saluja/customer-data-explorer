# Customer API - AWS CDK Setup

## Overview
This project uses AWS CDK to define and deploy a Lambda function with API Gateway for the Customer API.

## Prerequisites
- Node.js and npm
- AWS CLI configured with credentials
- AWS SAM CLI (for local testing): https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html

## Project Structure
```
├── bin/
│   └── cdk-app.ts          # CDK app entry point
├── lib/
│   └── customer-api-stack.ts # Stack definition with Lambda and API Gateway
├── src/
│   ├── main.ts             # Lambda handler
│   └── ...                 # Other source files
├── cdk.json                # CDK configuration
└── package.json            # Dependencies and scripts
```

## Available Scripts

### CDK Commands
- `npm run cdk:synth` - Synthesize CloudFormation template
- `npm run cdk:deploy` - Deploy stack to AWS
- `npm run cdk:diff` - Compare deployed stack with current state
- `npm run cdk:destroy` - Delete the stack from AWS

### Local Development
- `npm run local:start` - Start API Gateway locally with SAM CLI
- `npm run local:invoke` - Invoke Lambda function locally

## Running Locally

### 1. Install SAM CLI (if not already installed)
```bash
# macOS
brew install aws-sam-cli

# Or follow: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
```

### 2. Start Local API Server
```bash
npm run local:start
```

This will:
1. Synthesize the CDK stack to CloudFormation
2. Start a local API Gateway on http://127.0.0.1:3000

### 3. Test the API
```bash
# Health check
curl http://127.0.0.1:3000/customers?start=0&max=10

# With query parameters
curl "http://127.0.0.1:3000/customers?start=0&max=20"
```

## API Endpoint

**GET /customers**
- Query Parameters:
  - `start` (required): Starting customer ID
  - `max` (required): Maximum number of customers to return

Example:
```bash
curl "http://127.0.0.1:3000/customers?start=0&max=10"
```

## Deploying to AWS

### First-time Setup
```bash
# Bootstrap CDK in your AWS account (one-time setup)
npx cdk bootstrap aws://ACCOUNT-NUMBER/REGION
```

### Deploy
```bash
npm run cdk:synth   # Preview the CloudFormation template
npm run cdk:deploy  # Deploy to AWS
```

After deployment, the API Gateway URL will be displayed in the output.

## Environment Variables
You can add environment variables to the Lambda function in [lib/customer-api-stack.ts](lib/customer-api-stack.ts):

```typescript
environment: {
  NODE_ENV: 'production',
  LOG_LEVEL: 'info',
  // Add your custom variables here
},
```

## Troubleshooting

### SAM CLI Issues
- Make sure Docker is running (SAM CLI uses Docker to run Lambda locally)
- Verify SAM CLI is installed: `sam --version`

### CDK Issues
- Run `npm run cdk:synth` to check for errors in the stack definition
- Ensure AWS credentials are configured: `aws configure`

## Additional Resources
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [AWS SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [API Gateway with Lambda](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started-with-lambda-integration.html)
