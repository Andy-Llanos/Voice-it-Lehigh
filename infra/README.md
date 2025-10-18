# Infra (AWS CDK)
**Creates:** DynamoDB, Cognito (user pool + hosted UI domain), HTTP API (API Gateway v2) with JWT auth, custom domain `api.<domain>`, and Route53 record.


## Prereqs
- Domain hosted in Route53 (or import by ID)
- AWS CLI configured; CDK bootstrap: `cdk bootstrap aws://<acct>/us-east-1`


## Deploy
```bash
cd infra
npm i
npm run build
# set env vars
export DOMAIN_NAME=yourdomain.com
export API_SUBDOMAIN=api
export HOSTED_ZONE_ID=Z123EXAMPLE # optional, if you want to skip lookup
export COGNITO_DOMAIN_PREFIX=campus-feedback-team
npm run deploy