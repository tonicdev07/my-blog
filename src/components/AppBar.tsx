import Link from "next/link";
import React from "react";
import SigninButton from "./SigninButton";
import logo from "../assets/Logo.png";
import Image from "next/image";
import { Lobster } from "next/font/google";

const roboto = Lobster({
  weight: "400",
  subsets: ["latin"],
});

const AppBar = () => {
  return (
    <header className="fixed dark:bg-[#0e1217] bg-white w-full flex z-50 items-center gap-4 justify-between py-2 px-3 border-b-[0.1px] shadow">
      <div className="flex items-center gap-3">
        <Link
          className="transition-colors items-center flex hover:text-blue-500"
          href={"/"}
        >
          <Image
            className="mr-1"
            src={logo}
            alt="logo"
            height={40}
            width={40}
          />
          <span className={`${roboto.className}  text-xl`}>TonicDev</span>
        </Link>
      </div>
      <SigninButton />
    </header>
  );
};

export default AppBar;
