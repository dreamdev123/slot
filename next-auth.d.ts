import "next-auth";
import { IUser } from "./models/userSchema";

declare module "next-auth" {
  interface Session {
    user: IUser & {
      id: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT extends IUser {
    id: string;
  }
}
