"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import FloatBtn from "./floatBtn";
import { Lobster_Two } from "next/font/google";

const pacifico = Lobster_Two({
  weight: "400",
  subsets: ["latin"],
});

const SigninButton = () => {
  const { data: session } = useSession() as any;

  if (session && session.user) {
    return (
      <div className="flex gap-2 justify-start items-center  ml-auto">
        <p className={`${pacifico.className} md:text-lg sm:text-[16px] `}>
          {session.user.firstName + " " + session.user.lastName}
        </p>
        <FloatBtn user={session.user} />
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Link
        href={`/login`}
        className=" py-1 ml-auto px-1 rounded-sm dark:hover:bg-[#222b36] hover:bg-[#dadada]"
      >
        Kirish
      </Link>
    </div>
  );
};

export default SigninButton;
