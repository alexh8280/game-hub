// dbService.ts
import {
  DynamoDBClient,
  GetItemCommand,
  GetItemCommandInput,
  PutItemCommand,
  PutItemCommandInput,
  QueryCommand,
  QueryCommandInput,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/client-dynamodb";

const REGION = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials not found in environment variables");
}

const dbClient = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
const TABLE_NAME = "gamehub-user-data";

export async function putItem(params: PutItemCommandInput) {
  try {
    return await dbClient.send(new PutItemCommand(params));
  } catch (err) {
    console.error("Error putting item:", err);
    throw err;
  }
}

export async function getItem(params: GetItemCommandInput) {
  try {
    return await dbClient.send(new GetItemCommand(params));
  } catch (err) {
    console.error("Error getting item:", err);
    throw err;
  }
}

export async function queryItems(params: QueryCommandInput) {
  try {
    return await dbClient.send(new QueryCommand(params));
  } catch (err) {
    console.error("Error querying items:", err);
    throw err;
  }
}

export async function scanItems(params: ScanCommandInput) {
  try {
    return await dbClient.send(new ScanCommand(params));
  } catch (err) {
    console.error("Error scanning items:", err);
    throw err;
  }
}

export async function getUser(userId: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      userId: { S: userId },
    },
  };

  try {
    const data = await dbClient.send(new GetItemCommand(params));
    return data.Item;
  } catch (err) {
    console.error("Error getting user:", err);
    throw err;
  }
}

export const tableName = TABLE_NAME;
