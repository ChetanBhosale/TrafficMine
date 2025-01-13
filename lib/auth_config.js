import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import { checkOrCreateUser } from "@/app/actions/user";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account"
        }
      }
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/auth/new-user',
    signOut: '/', // Redirect to home page after sign out
  },

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user?.email) {
          return false;
        }
        const dbUser = await checkOrCreateUser(user, account);
        return !!dbUser;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.user = user;
      }

      // Handle session update
      if (trigger === "update" && session) {
        token.user = session.user;
      }

      return token;
    },

    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Handle sign out redirect
      if (url.includes('signout')) {
        return baseUrl;
      }
      
      // Handle other redirects
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account }) {
      console.log("User signed in:", user.email);
    },
    async signOut({ session }) {
      console.log("User signed out");
    },
    async error({ error }) {
      console.error("Auth error:", error);
    },
  },

  debug: process.env.NODE_ENV === "development",
};