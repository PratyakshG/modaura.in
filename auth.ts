import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "./lib/db";
import User from "./models/User";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      await connectDB();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          email: user.email,
          name: user.name || "",
          provider: account?.provider,
          password: "", // Empty because it's OAuth
          isAdmin: false,
          cartItems: [],
        });
      }

      return true;
    },

    async jwt({ token }) {
      await connectDB();

      // Fetch the user from DB using the email from the token
      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.isAdmin = dbUser.isAdmin || false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as any).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60, // 10 days
  },
  secret: process.env.AUTH_SECRET,
});
