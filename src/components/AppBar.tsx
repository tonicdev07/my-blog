"use client";

import Link from "next/link";
import React from "react";
import SigninButton from "./SigninButton";
import logo from "../assets/Logo.png";
import Image from "next/image";
import { Lobster } from "next/font/google";
import { useTheme } from "next-themes";

const roboto = Lobster({
  weight: "400",
  subsets: ["latin"],
});

const AppBar = () => {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <header
      className={`fixed border-b-[0.5px] ${
        currentTheme === "dark" || currentTheme === "system" ? "gradient" : "gradient_white"
      } rounded-r-[20%] flex z-50 items-center gap-4 justify-between py-2 px-3  `}
    >
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
          <span className={`${roboto.className} md:text-xl text-md`}>
            TonicDev
          </span>
        </Link>
      </div>
      <SigninButton />
    </header>
  );
};

export default AppBar;
