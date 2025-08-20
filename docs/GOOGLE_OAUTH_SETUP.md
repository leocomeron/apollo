# 🔐 Google OAuth Integration Setup Guide

## 📋 Overview

This guide will walk you through the complete setup of Google OAuth authentication using NextAuth.js for your Apollo project. The integration will allow users to sign in with their Google accounts while maintaining compatibility with your existing credential-based authentication system.

## 🎯 Current Status

✅ NextAuth.js already configured with Google Provider  
✅ Google sign-in button already implemented in login form  
✅ Basic environment variable structure in place  
✅ MongoDB integration configured  
✅ Existing users in `worker_hub` database

## 🚀 Step-by-Step Implementation

### Phase 1: Google Cloud Console Setup

#### 1.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Create a new project or select an existing one

#### 1.2 Enable Required APIs ✅

1. Navigate to "APIs & Services" > "Library"
2. Search for and enable these APIs:
   - Google+ API (if not already enabled)
   - Google Identity API

#### 1.3 Configure OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Select "Web application" as application type
4. Fill in the required fields:

**Authorized JavaScript origins:**

```
http://localhost:3000
https://manosalaobra.vercel.app
```

**Authorized redirect URIs:**

```
http://localhost:3000/api/auth/callback/google
https://manosalaobra.vercel.app//api/auth/callback/google
```

5. Click "Create"
6. **IMPORTANT**: Copy the `Client ID` and `Client Secret` - you'll need these for the next step

#### 1.4 Update Environment Variables

1. Open your `.env.local` file (create if it doesn't exist)
2. Add or update these variables:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

**Note**: Generate a secure `NEXTAUTH_SECRET` using:

```bash
openssl rand -base64 32
```

### Phase 2: Code Implementation

#### 2.1 Update NextAuth Configuration

Update your `src/pages/api/auth/[...nextauth].ts` file:

```typescript
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
                isVerified: true,
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
    async session({ session, token }) {
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
```

#### 2.2 Update Login Component

Update your `src/pages/login/index.tsx` file:

```typescript
import { isValidEmail, isValidPassword } from '@/utils/strings';
import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { status } = useSession();

  // Handle authentication errors from URL params
  useEffect(() => {
    const { error } = router.query;
    if (error === 'auth') {
      toast({
        title: 'Error de autenticación',
        description: 'Hubo un problema con el inicio de sesión. Por favor, intente nuevamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [router.query, toast]);

  if (status === 'loading') {
    return (
      <Center minH="100vh">
        <Text>Cargando...</Text>
      </Center>
    );
  }

  const validateForm = (email: string, password: string): boolean => {
    let isValid = true;

    if (!email) {
      setEmailError('El email es requerido');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Ingrese un email válido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('La contraseña es requerida');
      isValid = false;
    } else if (isSignup && !isValidPassword(password)) {
      setPasswordError(
        'La contraseña debe tener al menos 8 caracteres y una letra',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm(email, password)) {
      return;
    }

    setIsLoading(true);

    try {
      if (isSignup) {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const signInResult = await signIn('credentials', {
            redirect: false,
            email,
            password,
          });

          if (signInResult?.ok) {
            void router.push('/onboarding');
          } else {
            toast({
              title: 'Error al iniciar sesión',
              description:
                'Se creó la cuenta pero hubo un error al iniciar sesión',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top',
            });
          }
        } else {
          toast({
            title: 'Error al registrarse',
            description: 'Por favor, intente nuevamente',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        }
      } else {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });

        if (result?.ok) {
          void router.push('/onboarding');
        } else {
          toast({
            title: 'Error al iniciar sesión',
            description: 'Email o contraseña inválidos',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/onboarding' });
    } catch (error) {
      toast({
        title: 'Error al iniciar sesión con Google',
        description: 'Por favor, intente nuevamente',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setEmailError('El email es requerido');
    } else if (!isValidEmail(value)) {
      setEmailError('Ingrese un email válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setPasswordError('La contraseña es requerida');
    } else if (isSignup && !isValidPassword(value)) {
      setPasswordError(
        'La contraseña debe tener al menos 8 caracteres y una letra',
      );
    } else {
      setPasswordError('');
    }
  };

  return (
    <Center p={{ base: 4, md: 6 }}>
      <Box
        w={{ base: '100%', md: '400px' }}
        p={{ base: 5, md: 8 }}
        borderRadius="lg"
        boxShadow="lg"
      >
        <VStack spacing={{ base: 3, md: 4 }}>
          <Text fontSize="2xl" fontWeight="bold" mb={{ base: 1, md: 2 }}>
            {isSignup ? 'Crear Cuenta' : 'Inicia sesión'}
          </Text>

          <form onSubmit={handleAuth} style={{ width: '100%' }}>
            <VStack spacing={{ base: 3, md: 4 }} width="100%">
              <FormControl isInvalid={!!emailError}>
                <Input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Correo electrónico"
                  size="lg"
                  h={{ base: '50px', md: '52px' }}
                  fontSize={{ base: 'md', md: 'md' }}
                />
                {emailError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {emailError}
                  </Text>
                )}
              </FormControl>
              <FormControl isInvalid={!!passwordError}>
                <Input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Contraseña"
                  size="lg"
                  h={{ base: '50px', md: '52px' }}
                  fontSize={{ base: 'md', md: 'md' }}
                />
                {passwordError && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {passwordError}
                  </Text>
                )}
              </FormControl>
              <Button
                type="submit"
                colorScheme="orange"
                width="100%"
                size="lg"
                h={{ base: '50px', md: '52px' }}
                isLoading={isLoading}
                loadingText={
                  isSignup ? 'Registrando...' : 'Iniciando sesión...'
                }
              >
                {isSignup ? 'Registrarse' : 'Iniciar Sesión'}
              </Button>
            </VStack>
          </form>

          <Divider my={{ base: 3, md: 4 }} />

          <Button
            variant="ghost"
            onClick={() => setIsSignup(!isSignup)}
            width="100%"
            size={{ base: 'sm', md: 'lg' }}
            h={{ base: '45px', md: '52px' }}
          >
            {isSignup
              ? '¿Ya tienes una cuenta? Inicia sesión'
              : 'Crear una cuenta'}
          </Button>

          <Button
            onClick={handleGoogleSignIn}
            width="100%"
            size={{ base: 'sm', md: 'lg' }}
            h={{ base: '45px', md: '52px' }}
            leftIcon={<Text>🌐</Text>}
            variant="outline"
            colorScheme="gray"
            _hover={{ bg: 'gray.50' }}
            isLoading={isGoogleLoading}
            loadingText="Conectando con Google..."
          >
            Continuar con Google
          </Button>
        </VStack>
      </Box>
    </Center>
  );
};

export default AuthForm;
```

### Phase 3: Testing and Verification

#### 3.1 Local Development Testing

1. **Start your development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Test Google Sign-In:**

   - Navigate to `http://localhost:3000/login`
   - Click "Continuar con Google"
   - Complete the Google OAuth flow
   - Verify you're redirected to `/onboarding`

3. **Check Database:**

   - Verify the user was created/updated in your MongoDB `worker_hub.users` collection
   - Check that all required fields are populated correctly

4. **Test Session Persistence:**
   - Refresh the page
   - Verify the session is maintained
   - Check that user data is correctly loaded

#### 3.2 Error Handling Testing

1. **Test with invalid Google credentials** (if possible)
2. **Test network failures**
3. **Verify error messages are displayed correctly**

### Phase 4: Production Deployment

#### 4.1 Update Google Cloud Console

1. Go back to your OAuth 2.0 credentials
2. Add your production domain to authorized origins and redirect URIs
3. Remove `localhost:3000` if you don't need it in production

#### 4.2 Update Environment Variables

1. Set production environment variables on your hosting platform
2. Ensure `NEXTAUTH_URL` points to your production domain
3. Generate a new `NEXTAUTH_SECRET` for production

#### 4.3 Deploy and Test

1. Deploy your application
2. Test the complete Google OAuth flow in production
3. Verify database operations work correctly
4. Test error scenarios

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue: "Invalid redirect URI" Error

**Solution:** Ensure your redirect URIs in Google Cloud Console exactly match your application URLs, including protocol (http/https).

#### Issue: "Client ID not found" Error

**Solution:** Verify your environment variables are correctly set and the application has been restarted.

#### Issue: Users not being created in database

**Solution:** Check your MongoDB connection and ensure the `signIn` callback is executing correctly.

#### Issue: Session not persisting

**Solution:** Verify `NEXTAUTH_SECRET` is set and consistent across deployments.

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [MongoDB Adapter Documentation](https://next-auth.js.org/adapters/mongodb)

## 🎉 Success Criteria

Your Google OAuth integration is complete when:
✅ Users can sign in with Google accounts  
✅ New Google users are created in your database  
✅ Existing users are properly updated  
✅ Sessions persist correctly  
✅ Error handling works in all scenarios  
✅ Production deployment is successful

## 📞 Support

If you encounter issues during implementation:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check browser console and server logs for errors
4. Ensure MongoDB connection is working
5. Verify Google Cloud Console configuration

---

**Last Updated:** [Current Date]  
**Version:** 1.0  
**Author:** Apollo Development Team
