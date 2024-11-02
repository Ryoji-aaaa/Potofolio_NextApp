// next-auth.d.ts
import NextAuth,{ NextAuthUser } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      admin: boolean;
    };
  }
  interface Credentials {
    username: string;
    email: string;
    password: string;
  }
  interface User extends NextAuthUser {
    id: string;
    email: string;
    username: string;
    admin: boolean;
  }
}
