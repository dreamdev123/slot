"use client";
import { VerifyLoginPayloadParams, createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "./client";

import { createUser, loginWalletUser } from "../data/userData";
import { IUser } from "../models/userSchema";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";

export interface VerifyJWTResult {
  valid: boolean;
  payload?: {
    address: string;
    chainId: number;
    userId: string;
    username: string;
  };
  error?: string;
}

const privateKey = process.env.NEXT_PUBLIC_THIRDWEB_ADMIN_PRIVATE_KEY || "";

if (!privateKey) {
  throw new Error("Missing THIRDWEB_ADMIN_PRIVATE_KEY in .env file.");
}

export const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
  adminAccount: privateKeyToAccount({ client, privateKey }),
});

export const generatePayload = thirdwebAuth.generatePayload;

export async function getUserFromToken() {
  const cookies = document.cookie.split(";");
  const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("jwt="));
  const jwt = jwtCookie ? jwtCookie.split("=")[1] : null;

  if (!jwt) {
    return null;
  }

  const authResult = (await thirdwebAuth.verifyJWT({ jwt })) as VerifyJWTResult;

  if (authResult.valid && authResult.payload) {
    const payload = authResult.payload;
    return payload;
  }
  return null;
}

export async function login(
  payload: VerifyLoginPayloadParams | { email: string; password: string }
) {
  if ("email" in payload && "password" in payload) {
    // Credential-based login
    const result = await signIn("credentials", {
      redirect: false,
      email: payload.email,
      password: payload.password,
    });

    if (result?.error) {
      throw new Error(`Failed to sign in: ${result.error}`);
    }

    if (!result?.ok) {
      throw new Error("Failed to sign in");
    }

    // Redirect to profile page
    window.location.href = "/profile";
    return;
  } else {
    // Wallet-based login
    const verifiedPayload = await thirdwebAuth.verifyPayload(payload);
    if (verifiedPayload.valid) {
      const walletAddress = verifiedPayload.payload.address;

      let user = await loginWalletUser(walletAddress);

      if (!user) {
        // Create new user if not found
        const newUserData: Partial<IUser> = {
          walletAddress,
          username: `User_${walletAddress.slice(0, 6)}`,
          email: `${walletAddress}@example.com`,
          pfpUrl: "/sprites/logo.png",
          currentBalance: 0,
          spinsWon: 0,
          totalSpins: 0,
          totalEarnings: 0,
          totalDeposits: 0,
          isAdmin: false,
        };
        user = await createUser(newUserData as IUser);
      }

      // Create NextAuth session
      const result = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.walletAddress, // Using walletAddress as password for wallet-based auth
        walletAddress: user.walletAddress,
      });

      if (result?.error) {
        console.error("SignIn error:", result.error);
        throw new Error(`Failed to create session: ${result.error}`);
      }

      if (!result?.ok) {
        throw new Error("Failed to sign in");
      }

      const customPayload = {
        ...verifiedPayload.payload,
        userId: user._id,
        username: user.username,
      };

      const jwt = await thirdwebAuth.generateJWT({
        payload: customPayload as any,
      });
      document.cookie = `jwt=${jwt}; path=/; max-age=86400`;

      return { success: true, user };
    }
    throw new Error("Invalid login payload");
  }
}

export async function authedOnly() {
  const cookies = document.cookie.split(";");
  const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("jwt="));
  const jwt = jwtCookie ? jwtCookie.split("=")[1] : null;

  if (!jwt) {
    window.location.href = "/login2";
  }

  const authResult = await thirdwebAuth.verifyJWT({ jwt });
  if (!authResult.valid) {
    window.location.href = "/login2";
    return;
  }
  return (authResult as unknown as { valid: true; payload: any }).payload;
}

export async function logout() {
  document.cookie = "jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}
