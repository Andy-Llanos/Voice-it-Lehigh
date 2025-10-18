import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
const TABLE = process.env.TABLE!;


export const handler: APIGatewayProxyHandlerV2 = async (event) => {
const user = (event.requestContext.authorizer as any)?.jwt?.claims || {};
const sub = user.sub || 'anon';
const now = new Date().toISOString();


if (event.requestContext.http.method === 'GET') {
const tenant = event.queryStringParameters?.tenant || 'campus';
const q = await ddb.send(new QueryCommand({
TableName: TABLE,
KeyConditionExpression: 'pk = :pk AND begins_with(sk, :room)',
ExpressionAttributeValues: { ':pk': { S: `TENANT#${tenant}` }, ':room': { S: 'ROOM#' } },
ScanIndexForward: false
}));
const items = (q.Items||[]).map(i => ({
id: i.sk.S!.replace('ROOM#',''),
tenantId: i.pk.S!.replace('TENANT#',''),
targetType: i.targetType.S,
targetId: i.targetId.S,
title: i.title.S,
open: i.open.BOOL,
createdBy: i.createdBy.S,
createdAt: i.createdAt.S
}));
return resp(200, items);
}


if (event.requestContext.http.method === 'POST') {
const body = JSON.parse(event.body||'{}');
const id = randomUUID();
await ddb.send(new PutItemCommand({
TableName: TABLE,
Item: {
pk: { S: `TENANT#${body.tenantId || 'campus'}` },
sk: { S: `ROOM#${id}` },
title: { S: body.title || 'Untitled' },
targetType: { S: body.targetType || 'COURSE' },
targetId: { S: body.targetId || 'GEN' },
open: { BOOL: true },
createdBy: { S: sub },
createdAt: { S: now }
}
}));
return resp(200, { id });
}


return resp(405, { error: 'Method not allowed' });
};


const resp = (code:number, body:any)=>({ statusCode: code, headers:{'Content-Type':'application/json', 'Access-Control-Allow-Origin':'*'}, body: JSON.stringify(body) });