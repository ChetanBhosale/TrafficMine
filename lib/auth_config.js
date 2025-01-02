import { checkOrCreateUser } from "@/app/actions/user";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {  
        async signIn({ user }) {
            if (user && user.email) {
                const dbUser = await checkOrCreateUser(user)

                if (dbUser) {
                    return true  
                }
                return false
            }
            return false
        },
        async jwt({ token, user }) {

            if (user && user.email) {
                const dbUser = await checkOrCreateUser(user)

                if (dbUser) {
                    token.user = dbUser
                    return token
                }
                return null
            }
            return token 
        },
        async session({ session, token }) {

            if (token) {
                session.user = token.user
                return session
            }
            return null
        },
        async redirect({ baseUrl }) {
            return baseUrl
        },
    }
};