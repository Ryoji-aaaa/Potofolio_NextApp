// app/api/auth/[...nextauth]/route.ts
import NextAuth, { Credentials,NextAuthOptions,User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import { compare } from "bcryptjs";
import UserModel from "@/lib/UserModels";


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
  console.log(user);
  return { id: user._id.toString(), email: user.email, username: user.username , admin: user.admin };
};

const authOptions :NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email"
        },
        password: { label: "Password", type: "password" },
        username: { label: "Username", type: "text" },
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
        token.admin = user.admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id ? String(token.id) : "",          
          email: token.email || "",      
          username: token.username ? String(token.username) : "" ,
          admin : token.admin ? Boolean(token.admin) : false
        };
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
