import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import axios from 'axios';
export default NextAuth({
  providers: [
    CredentialProvider({
        credentials: {
            email: { label: 'Email', type: 'text'},
            password: { label: 'Password', type: 'password' }
          },
      async authorize(credentials) {
        
        const payload = {
            email: credentials.email,
            password: credentials.password,
          };

          try {
             

            const LOGIN_END_POINT = process.env.NEXT_PUBLIC_API_ROOT + 'login'
        
            const res = await fetch(LOGIN_END_POINT, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
              'Content-Type': 'application/json', 
              'Accept-Language': 'en-US',
            },
          });
  
          const user = await res.json() 
           
          // If no error and we have user data, return it
          if (res.ok && user) {
            return user;
          }
  
          // Return null if user data could not be retrieved
          return null;
        
        } catch (error) {
          console.log("ERROR", error);

            throw new Error(error);
            
          }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    newUser: '/register',
    error: '/login',
    signOut: '/signout',
    
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async jwt({ token, user }) {
        user && (token.user = user);
        return token;
    },
    async session({ session, token }) {
        session.user = token.user;  // Setting token in session
        return session;
      },
  },
});