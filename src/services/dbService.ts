// dbService.ts
import {
  GetItemCommandInput,
  PutItemCommandInput,
} from "@aws-sdk/client-dynamodb";
import axios from "axios";
export const tableName = "gamehub-user-data";
const BASE_URL = "http://localhost:5000"; // replace with your server's URL

export async function putItem(params: PutItemCommandInput) {
  try {
    const response = await axios.post(`${BASE_URL}/putItem`, params);
    return response.data;
  } catch (err) {
    console.error("Error putting item:", err);
    throw err;
  }
}

export async function getItem(params: GetItemCommandInput) {
  try {
    const response = await axios.get(`${BASE_URL}/getItem`, { params });
    return response.data;
  } catch (err) {
    console.error("Error getting item:", err);
    throw err;
  }
}

export async function queryItems(params: any) {
  try {
    const response = await axios.post(`${BASE_URL}/queryItems`, params);
    return response.data;
  } catch (err) {
    console.error("Error querying items:", err);
    throw err;
  }
}

export async function scanItems(params: {
  FilterExpression: string;
  ExpressionAttributeValues: { [key: string]: string };
}) {
  // Check if ExpressionAttributeValues is defined
  if (!params.ExpressionAttributeValues) {
    throw new Error("ExpressionAttributeValues is undefined");
  }

  // Format ExpressionAttributeValues for DynamoDB
  const ExpressionAttributeValues: { [key: string]: { S: string } } = {};
  for (const key in params.ExpressionAttributeValues) {
    ExpressionAttributeValues[key] = {
      S: params.ExpressionAttributeValues[key],
    };
  }

  const formattedParams = {
    ...params,
    ExpressionAttributeValues,
  };

  try {
    const response = await axios.post(`${BASE_URL}/scanItems`, formattedParams);
    return response.data;
  } catch (err) {
    console.error("Error scanning items:", err);
    throw err;
  }
}

export async function getUser(userId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/getUser`, {
      params: { userId },
    });
    return response.data;
  } catch (err) {
    console.error("Error getting user:", err);
    throw err;
  }
}
