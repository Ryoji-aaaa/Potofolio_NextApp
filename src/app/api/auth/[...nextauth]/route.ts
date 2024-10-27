// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import { compare } from "bcryptjs";
import UserModel from "@/lib/SchemaModels";

interface Credentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  username: string;
}

const authorize = async (credentials: Credentials | undefined): Promise<User | null> => {
  if (!credentials) {
    console.log("No credentials provided");
    return null;
  }

  await connectDB();
  const user = await UserModel.findOne({ email: credentials.email });

  if (!user) {
    console.log("User not found");
    return null;
  }

  const isValidPassword = await compare(credentials.password, user.password);
  if (!isValidPassword) {
    console.log("Invalid password");
    return null;
  }

  console.log("User authenticated successfully");
  return { id: user._id.toString(), email: user.email, username: user.username };
};

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "your-email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.username = token.username;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
