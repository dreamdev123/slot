import NextAuth, { NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import connectMongo from "../config/database"; // Adjust the path as needed
import User, { IUser } from "../models/userSchema";

interface CustomSession extends Omit<DefaultSession, "user"> {
  user: {
    id: string;
    email: string;
    username: string;
    pfpUrl: string;
    spinsWon: number;
    totalSpins: number;
    totalEarnings: number;
    totalDeposits: number;
    isAdmin: boolean;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(connectMongo as any) as NextAuthOptions["adapter"],
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        walletAddress: { label: "Wallet Address", type: "text" }, // Add walletAddress as a credential
      },
      async authorize(credentials) {
        try {
          await connectMongo();
          const { email, password, walletAddress } = credentials as {
            email: string;
            password: string;
            walletAddress?: string;
          };

          let user;
          if (walletAddress) {
            // Wallet-based login
            user = await User.findOne({ walletAddress });
            if (!user) {
              console.error(
                "User not found for wallet address:",
                walletAddress
              );
              return null;
            }
          } else {
            // Email-based login
            user = await User.findOne({ email });
            if (!user || !bcrypt.compareSync(password, user.password)) {
              console.error("Invalid email or password");
              return null;
            }
          }

          if (!user) {
            console.error("User not found");
            return null;
          }

          console.log("User found:", user);

          return {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            pfpUrl: user.pfpUrl,
            spinsWon: user.spinsWon,
            totalSpins: user.totalSpins,
            totalEarnings: user.totalEarnings,
            totalDeposits: user.totalDeposits,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const typedUser = user as IUser;
        token.id = typedUser.id;
        token.username = typedUser.username;
        token.email = typedUser.email;
        token.pfpUrl = typedUser.pfpUrl;
        token.spinsWon = typedUser.spinsWon;
        token.totalSpins = typedUser.totalSpins;
        token.totalEarnings = typedUser.totalEarnings;
        token.totalDeposits = typedUser.totalDeposits;
        token.isAdmin = typedUser.isAdmin;
      }
      return token;
    },
    async session({ session, token }): Promise<CustomSession> {
      return {
        ...session,
        user: {
          id: token.id as string,
          email: session.user.email,
          username: token.username as string,
          pfpUrl: token.pfpUrl as string,
          spinsWon: token.spinsWon as number,
          totalSpins: token.totalSpins as number,
          totalEarnings: token.totalEarnings as number,
          totalDeposits: token.totalDeposits as number,
          isAdmin: token.isAdmin as boolean,
        },
      };
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
