import { Stack, StackProps, Duration, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
interface Props extends StackProps {
domainName: string;
apiSubdomain: string; // e.g., 'api'
hostedZoneId?: string; // optional explicit hosted zone id
cognitoDomainPrefix: string; // user pool hosted UI domain prefix
}


export class RfStack extends Stack {
constructor(scope: Construct, id: string, props: Props) {
super(scope, id, props);


// Hosted zone (must already exist in Route53 or be imported)
const zone = props.hostedZoneId
? route53.HostedZone.fromHostedZoneAttributes(this, 'Zone', { hostedZoneId: props.hostedZoneId, zoneName: props.domainName })
: route53.HostedZone.fromLookup(this, 'ZoneLookup', { domainName: props.domainName });


// DynamoDB table (single-table design)
const table = new ddb.Table(this, 'Table', {
partitionKey: { name: 'pk', type: ddb.AttributeType.STRING },
sortKey: { name: 'sk', type: ddb.AttributeType.STRING },
billingMode: ddb.BillingMode.PAY_PER_REQUEST,
timeToLiveAttribute: 'ttlEpoch',
removalPolicy: RemovalPolicy.DESTROY
});
table.addGlobalSecondaryIndex({ indexName:'GSI1', partitionKey:{name:'gsi1pk', type: ddb.AttributeType.STRING}, sortKey:{name:'gsi1sk', type: ddb.AttributeType.STRING} });


// Cognito User Pool
const userPool = new cognito.UserPool(this, 'UserPool', {
signInAliases: { email: true },
selfSignUpEnabled: true,
removalPolicy: RemovalPolicy.DESTROY
});
const userClient = new cognito.UserPoolClient(this, 'UserClient', { userPool, generateSecret: false, authFlows: { userSrp: true } });
const userPoolDomain = new cognito.UserPoolDomain(this, 'UserPoolDomain', { userPool, cognitoDomain: { domainPrefix: props.cognitoDomainPrefix } });


// Lambda functions
const commonEnv = { TABLE: table.tableName };
const roomsFn = new node.NodejsFunction(this, 'RoomsFn', { entry: '../backend/lambdas/rooms.ts', runtime: lambda.Runtime.NODEJS_20_X, timeout: Duration.seconds(10), environment: commonEnv });
const feedbackFn = new node.NodejsFunction(this, 'FeedbackFn', { entry: '../backend/lambdas/feedback.ts', runtime: lambda.Runtime.NODEJS_20_X, timeout: Duration.seconds(10), environment: commonEnv });
table.grantReadWriteData(roomsFn);
table.grantReadWriteData(feedbackFn);


// HTTP API with JWT authorizer (Cognito)
const httpApi = new apigwv2.HttpApi(this, 'HttpApi', { corsPreflight: { allowOrigins: ['*'], allowMethods: [apigwv2.CorsHttpMethod.ANY], allowHeaders: ['*'] } });


const jwtAuth = new authorizers.HttpJwtAuthorizer('JwtAuth', `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`, { audience: [userClient.userPoolClientId] });


httpApi.addRoutes({ path: '/rooms', methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST], integration: new integrations.HttpLambdaIntegration('RoomsInt', roomsFn), authorizer: jwtAuth });
httpApi.addRoutes({ path: '/rooms/{roomId}/feedback', methods: [apigwv2.HttpMethod.GET, apigwv2.HttpMethod.POST], integration: new integrations.HttpLambdaIntegration('FeedbackInt', feedbackFn), authorizer: jwtAuth });


// Custom domain for API: api.<domain>
const cert = new acm.DnsValidatedCertificate(this, 'ApiCert', { domainName: `${props.apiSubdomain}.${props.domainName}`, hostedZone: zone, region: 'us-east-1' });
const domainName = new apigwv2.DomainName(this, 'ApiDomain', { domainName: `${props.apiSubdomain}.${props.domainName}`, certificate: cert });
new apigwv2.ApiMapping(this, 'ApiMapping', { api: httpApi, domainName, stage: httpApi.defaultStage! });


new route53.ARecord(this, 'ApiAlias', { zone, recordName: `${props.apiSubdomain}.${props.domainName}`, target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)) });


// Outputs for frontend config
new CfnOutput(this, 'ApiUrl', { value: `https://${props.apiSubdomain}.${props.domainName}` });
new CfnOutput(this, 'UserPoolId', { value: userPool.userPoolId });
new CfnOutput(this, 'UserPoolClientId', { value: userClient.userPoolClientId });
new CfnOutput(this, 'CognitoHostedUIDomain', { value: `https://${userPoolDomain.domainName}.auth.${this.region}.amazoncognito.com` });
}
}