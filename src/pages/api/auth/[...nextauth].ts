import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const clientPromise = new MongoClient(process.env.MONGODB_URI as string).connect();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db('myFirstDatabase');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('No user found with the email');
        }

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) {
          throw new Error('Could not log you in');
        }

        return { id: user._id.toString(), email: user.email };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});
