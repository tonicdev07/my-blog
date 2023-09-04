"use client";
import {  signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const SigninButton = () => {
  const { data: session } = useSession() as any;

  if (session && session.user) {
    return (
      <div className="flex gap-4 ml-auto">
        <p className="text-sky-600">
          {session.user.firstName + " " + session.user.lastName}
        </p>
        <button onClick={() => signOut()} className="text-red-600">
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Link
        href={`/login`}
        className=" py-1 ml-auto px-1 rounded-sm dark:hover:bg-[#222b36] hover:bg-[#dadada]"
      >
        Sign In
      </Link>
      <Link
        href={`/signup`}
        className=" py-1 ml-auto px-1 rounded-sm dark:hover:bg-[#222b36] hover:bg-[#dadada]"
      >
        Sign Up
      </Link>
    </div>
  );
};

export default SigninButton;
