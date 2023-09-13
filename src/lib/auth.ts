import { makeRequest } from "@/services/makeRequest";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth/next";

interface GoogleProviderTy {
  clientId: string;
  clientSecret: string;
}

interface GoogleData {
  given_name: string;
  family_name: string;
  email: string;
  picture: string;
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Elektron pochta",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "parol",
        },
      },
      async authorize(credentials) {
        const res = await makeRequest("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        if (res) {
          return res;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
    } as GoogleProviderTy),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (profile !== undefined) {
        const dataProfile = profile as GoogleData;
        const response = await makeRequest("/api/auth/userExists", {
          method: "POST",
          data: {
            email: dataProfile.email,
          },
        });

        if (response && response.isCheck === true) {
          return true;
        } else {
          const data = {
            firstName: dataProfile.given_name,
            lastName: dataProfile.family_name,
            email: dataProfile.email,
            image: dataProfile.picture,
            username: dataProfile.given_name + dataProfile.family_name,
            password: process.env.USER_PASSWORD,
          };
          await makeRequest("/api/register", {
            method: "POST",
            data: data,
          });
          return true;
        }
      } else {
        return true;
      }
    },
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }: any) {
      const response = async () => {
        if (!token.accessToken) {
          const data = await makeRequest("/api/auth/userExists", {
            method: "POST",
            data: { email: session?.user?.email },
          });
          return data;
        }
        return null;
      };
      const data = await response();

      session.user = data === null ? token : (data as any);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 60 * 60,
    secret: process.env.SECRET_KEY,
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
};

export default NextAuth(authOptions);
