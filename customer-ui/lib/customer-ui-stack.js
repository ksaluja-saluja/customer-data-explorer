import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
export class CustomerUiStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const siteBucket = new s3.Bucket(this, 'CustomerUiWebsiteBucket', {
            websiteIndexDocument: 'index.html',
            websiteErrorDocument: 'index.html',
            publicReadAccess: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
        });
        new s3deploy.BucketDeployment(this, 'CustomerUiDeployStaticFiles', {
            destinationBucket: siteBucket,
            sources: [s3deploy.Source.asset('dist')],
        });
        new cdk.CfnOutput(this, 'WebsiteBucketName', {
            value: siteBucket.bucketName,
            description: 'S3 bucket name for customer-ui static website',
            exportName: `CustomerUiWebsiteBucketName-${props.deployEnv}`,
        });
        new cdk.CfnOutput(this, 'WebsiteUrl', {
            value: siteBucket.bucketWebsiteUrl,
            description: 'S3 static website URL for customer-ui',
            exportName: `CustomerUiWebsiteUrl-${props.deployEnv}`,
        });
    }
}
