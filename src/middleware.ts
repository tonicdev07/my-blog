// Ref: https://next-auth.js.org/configuration/nextjs#advanced-usage
import { getToken } from "next-auth/jwt";
import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(request: NextRequestWithAuth) {
    // console.log(request.nextauth.token?.role)

    if (
      request.nextUrl.pathname.startsWith("/admin/post") &&
      request.nextauth.token?.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/denied", request.url));
    }

    // if (
    //   request.nextUrl.pathname.startsWith("/client") &&
    //   request.nextauth.token?.role !== "admin" &&
    //   request.nextauth.token?.role !== "manager"
    // ) {
    //   return NextResponse.rewrite(new URL("/denied", request.url));
    // }
  },
  {
    secret: process.env.SECRET_KEY,
    callbacks: {
      authorized: async ({ token }) => {        
        return !!token;
      },
    },
  }
);

export const config = { matcher: ["/admin/post"] };
