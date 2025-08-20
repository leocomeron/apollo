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
          // Create new user with Google data
          await db.collection('users').insertOne({
            email: user.email,
            profilePicture: user.image,
            firstName: user.name?.split(' ')[0] || null,
            lastName: user.name?.split(' ').slice(1).join(' ') || null,
            isVerified: true, // Google users are verified
            isWorker: false,
            isOnboardingCompleted: false,
            createdAt: new Date(),
            categories: [],
            description: null,
            contact: null,
            birthDate: null,
            documents: [],
          });
        } else {
          // Update existing user with Google data if needed
          await db.collection('users').updateOne(
            { email: user.email },
            {
              $set: {
                profilePicture: user.image || existingUser.profilePicture,
              },
              $setOnInsert: {
                // Only set if they don't exist
                ...(existingUser.firstName
                  ? {}
                  : { firstName: user.name?.split(' ')[0] || null }),
                ...(existingUser.lastName
                  ? {}
                  : {
                      lastName:
                        user.name?.split(' ').slice(1).join(' ') || null,
                    }),
              },
            },
          );
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
          description: dbUser.description || null,
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
      // If it's a Google OAuth callback and the URL is the base URL, redirect to onboarding
      // The onboarding page will handle redirecting to profile if user already completed onboarding
      if (url === baseUrl) {
        return `${baseUrl}/onboarding`;
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login?error=auth',
    signOut: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
});
