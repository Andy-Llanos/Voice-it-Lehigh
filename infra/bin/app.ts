#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { RfStack } from '../lib/stack.js';


const app = new App();
new RfStack(app, 'RfStack', {
env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
domainName: process.env.DOMAIN_NAME || 'yourdomain.com',
apiSubdomain: process.env.API_SUBDOMAIN || 'api',
hostedZoneId: process.env.HOSTED_ZONE_ID || undefined,
cognitoDomainPrefix: process.env.COGNITO_DOMAIN_PREFIX || 'campus-feedback-' + Math.random().toString(36).slice(2,8)
});