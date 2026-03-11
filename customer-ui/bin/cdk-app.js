#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CustomerUiStack } from '../lib/customer-ui-stack.js';
const app = new cdk.App();
const deployEnv = process.env.DEPLOY_ENV ?? 'dev';
const stackSuffix = deployEnv.charAt(0).toUpperCase() + deployEnv.slice(1).toLowerCase();
new CustomerUiStack(app, `CustomerUiStack${stackSuffix}`, {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? 'us-east-1',
    },
    description: `Customer UI static website stack (${deployEnv})`,
    deployEnv,
});
app.synth();
