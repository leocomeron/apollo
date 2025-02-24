import { env } from '@/lib/env';
import clientPromise from '@/lib/mongodb';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: env.google.clientId,
      clientSecret: env.google.clientSecret,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const client = await clientPromise;
        const db = client.db('worker_hub');

        const user = await db
          .collection('users')
          .findOne({ email: credentials?.email });

        if (
          user &&
          credentials &&
          bcrypt.compareSync(credentials.password, user.password)
        ) {
          return {
            id: user._id.toString(),
            email: user.email,
            image: user.image || null,
          };
        }

        throw new Error('Invalid email or password');
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const client = await clientPromise;
        const db = client.db('worker_hub');

        const existingUser = await db
          .collection('users')
          .findOne({ email: user.email });

        if (!existingUser) {
          await db.collection('users').insertOne({
            email: user.email,
            profilePicture: user.image,
            firstName: null,
            lastName: null,
            isVerified: false,
            isWorker: false,
            isOnboardingCompleted: false,
            createdAt: new Date(),
          });
        }
      }
      return true;
    },
    async session({ session }) {
      const client = await clientPromise;
      const db = client.db('worker_hub');

      const dbUser = await db
        .collection('users')
        .findOne({ email: session.user?.email });

      if (dbUser && session.user) {
        session.user = {
          ...session.user,
          id: dbUser._id.toString(),
          firstName: dbUser.firstName || null,
          lastName: dbUser.lastName || null,
          isVerified: dbUser.isVerified || false,
          isWorker: dbUser.isWorker || false,
          isOnboardingCompleted: dbUser.isOnboardingCompleted || false,
          profilePicture: dbUser.profilePicture || dbUser.image || null,
          createdAt: dbUser.createdAt || null,
          categories: dbUser.categories || [],
          contact: dbUser.contact || null,
          birthDate: dbUser.birthDate || null,
          documents: dbUser.documents || [],
        };
      }

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
});
