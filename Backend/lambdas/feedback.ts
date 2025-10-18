import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
const user = (event.requestContext.authorizer as any)?.jwt?.claims || {};
const sub = user.sub || 'anon';
const roomId = event.pathParameters?.roomId!;
const now = new Date().toISOString();


if (event.requestContext.http.method === 'GET') {
const q = await ddb.send(new QueryCommand({
TableName: TABLE,
IndexName: 'GSI1',
KeyConditionExpression: 'gsi1pk = :pk AND begins_with(gsi1sk, :fb)',
ExpressionAttributeValues: { ':pk': { S: `ROOM#${roomId}` }, ':fb': { S: 'FEEDBACK#' } },
ScanIndexForward: false,
Limit: 50
}));
const isStaff = (user['cognito:groups']||'').includes('instructor') || (user['cognito:groups']||'').includes('ta') || (user['cognito:groups']||'').includes('org_admin');
const items = (q.Items||[]).map(i => ({
id: i.sk.S!.replace('FEEDBACK#',''),
roomId,
text: i.text?.S,
rating: i.rating?.N ? Number(i.rating.N) : undefined,
anonMode: i.anonMode?.BOOL ?? true,
authorId: isStaff ? i.authorId?.S : undefined,
viewerIsStaff: isStaff,
createdAt: i.createdAt.S
}));
return ok(items);
}


if (event.requestContext.http.method === 'POST') {
const body = JSON.parse(event.body||'{}');
const id = randomUUID();
const epoch = Date.now();
const ttl = Math.floor((epoch + 90*24*3600*1000)/1000); // 90 days
await ddb.send(new PutItemCommand({
TableName: TABLE,
Item: {
pk: { S: `ROOM#${roomId}` },
sk: { S: `FEEDBACK#${id}` },
gsi1pk: { S: `ROOM#${roomId}` },
gsi1sk: { S: `FEEDBACK#${String(1e13-epoch)}` },
authorId: { S: sub },
anonMode: { BOOL: !!body.anonMode },
kind: { S: body.kind || 'TEXT' },
text: body.text ? { S: body.text } : undefined,
rating: body.rating ? { N: String(body.rating) } : undefined,
createdAt: { S: new Date(epoch).toISOString() },
ttlEpoch: { N: String(ttl) }
}
}));
return ok({ id });
}


return { statusCode: 405, body: 'Method not allowed' };
};


const ok = (b:any)=>({ statusCode: 200, headers:{'Content-Type':'application/json','Access-Control-Allow-Origin':'*'}, body: JSON.stringify(b)});