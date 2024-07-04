import bodyParser from 'body-parser';
import express from 'express';
import { DynamoDBClient, ResourceNotFoundException } from '@aws-sdk/client-dynamodb';
import { PutCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const env = process.env.ENV;
const tableName = process.env.TABLE_NAME || 'CallbackTesterLog';

const app = express();
// expressでPOSTされたJSONをパースするための設定
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

let params = { region: 'ap-northeast-1' };
if (env === 'docker') {
    const ddbParams = {
        endpoint: 'http://dynamodb-local:8000',
        credentials: {
            accessKeyId: 'dummy',
            secretAccessKey: 'dummy',
        },
    };
    params = { ...params, ...ddbParams };
}

const client = new DynamoDBClient(params);
const docClient = DynamoDBDocumentClient.from(client);

app.get('/', (req, res) => {
    res.send({
        message: `this is sam-express-typescript on ${env}.`,
    });
});

app.get('/user/:userId?', async (req, res) => {
    const userId = req.params.userId || 'default';
    const command = new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: 'UserId = :u',
        ExpressionAttributeValues: { ':u': userId },
    });

    try {
        const response = await docClient.send(command);
        const data = response.Items?.map((item) => ({
            userId: item.UserId,
            unixtime: new Date(item.Unixtime + 9 * 60 * 60 * 1000),
            payload: JSON.parse(item.Payload ?? '{}'),
        }));
        res.send(data);
    } catch (error) {
        if (error instanceof ResourceNotFoundException) {
            let mes = 'テーブルが作成されていません。';
            if (env === 'docker') {
                mes += 'README.mdを参照して作成ください。';
            }
            res.status(500).send(mes);
        } else {
            res.status(500).send(error);
        }
    }
});

app.post('/user/:userId?', async (req, res) => {
    const userId = req.params.userId || 'default';

    const command = new PutCommand({
        TableName: tableName,
        Item: {
            UserId: userId,
            Unixtime: Date.now(),
            Payload: JSON.stringify(req.body),
            TTL: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
        },
    });
    try {
        await docClient.send(command);
        res.send({
            message: 'OK',
            userId: userId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
});

export default app;
