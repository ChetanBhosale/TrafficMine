import { checkUserExistsOrCreate } from "@/app/actions/user";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        if (user) {
          const validateUser = await checkUserExistsOrCreate(user);
          if (validateUser) {
            user.id = validateUser.id;
            return true;
          } else {
            throw new Error("Error creating user");
          }
        }
      } catch (error) {
        console.error(error.message || "Failed to validate user");
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user && user.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === "/api/auth/signout") {
        return "/";
      }
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
};
