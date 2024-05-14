// dbService.ts
import {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  AttributeValue,
  ScanCommand,
  QueryCommandInput,
  ScanCommandInput,
  GetItemCommandInput,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
const REGION = "us-east-1";
const accessKeyId = process.env.REACT_APP_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_SECRET_ACCESS_KEY;

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
    const data = await dbClient.send(new PutItemCommand(params));
    return data;
  } catch (err) {
    console.error("Error putting item:", err);
    throw err;
  }
}

export async function getItem(params: GetItemCommandInput) {
  try {
    const data = await dbClient.send(new GetItemCommand(params));
    return data;
  } catch (err) {
    console.error("Error getting item:", err);
    throw err;
  }
}

export async function queryItems(params: QueryCommandInput) {
  try {
    const data = await dbClient.send(new QueryCommand(params));
    return data;
  } catch (err) {
    console.error("Error querying items:", err);
    throw err;
  }
}

export async function scanItems(params: ScanCommandInput) {
  try {
    const data = await dbClient.send(new ScanCommand(params));
    return data;
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
