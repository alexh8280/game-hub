import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { putItem, getUser, scanItems } from "../services/dbService";
import { PutItemCommandInput } from "@aws-sdk/client-dynamodb";

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
      userId: uuidv4(),
      username: username,
      password: hashedPassword,
    } as unknown as PutItemCommandInput;
    try {
      const data = await putItem(params);
      console.log("User registered successfully:", data);
    } catch (err) {
      console.error("Error registering user:", err);
    }
  }

  async function getUserIdFromUsername(username: string) {
    const params = {
      FilterExpression: "username = :username",
      ExpressionAttributeValues: {
        ":username": username,
      },
    };

    const data = await scanItems(params);
    if (data.Items && data.Items.length > 0) {
      return data.Items[0].userId;
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

    try {
      const data = await getUser(userId);
      // Assuming data is of type User | null
      return data;
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
