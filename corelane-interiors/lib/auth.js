import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Admin Login',
      credentials: {
        email:    { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          credentials.email    === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          return { id: 1, name: 'Vinod Chauhan', email: credentials.email };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET,
};