import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { putItem, getItem, scanItems, tableName } from "../services/dbService";
import { GetItemCommandInput } from "@aws-sdk/client-dynamodb";

export interface User {
  userId: string;
  username: string;
  password: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  async function registerUser(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const params = {
      TableName: tableName,
      Item: {
        userId: { S: uuidv4() },
        username: { S: username },
        password: { S: hashedPassword },
      },
    };

    try {
      const data = await putItem(params);
      console.log("User registered successfully:", data);
    } catch (err) {
      console.error("Error registering user:", err);
    }
  }

  async function getUserIdFromUsername(username: string) {
    const params = {
      TableName: tableName,
      FilterExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": { S: username },
      },
    };

    const data = await scanItems(params);
    if (data.Items && data.Items.length > 0) {
      return data.Items[0].userId.S;
    } else {
      throw new Error("User not found");
    }
  }

  async function authenticateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const userId = await getUserIdFromUsername(username);

    if (!userId) {
      throw new Error("User ID not found");
    }

    const params: GetItemCommandInput = {
      TableName: tableName,
      Key: {
        userId: { S: userId },
      },
    };

    try {
      const data = await getItem(params);

      if (data.Item) {
        const hashedPassword = data.Item.password.S;
        if (!hashedPassword) {
          throw new Error("Hashed password not found");
        }
        const passwordMatches = await bcrypt.compare(password, hashedPassword);
        if (!passwordMatches) {
          throw new Error("Invalid password");
        }
        const userId = data.Item.userId.S;
        const username = data.Item.username.S;
        const storedPassword = data.Item.password.S;
        if (!userId || !username || !storedPassword) {
          throw new Error("User data not found");
        }
        const user = {
          userId,
          username,
          password: storedPassword,
        };
        setUser(user);
        console.log("User in useAuth: ", user);

        return user;
      } else {
        throw new Error("User not found");
      }
    } catch (err) {
      console.error("Error authenticating user:", err);
      throw err;
    }
  }

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    } else {
      setUsername(null);
    }
  }, [user]);

  return {
    user,
    setUser,
    registerUser,
    authenticateUser,
    username,
  };
}
