"use client";

import { PostProvider } from "@/context/context";
import { useSession } from "next-auth/react";
import React, { FC, ReactNode } from "react";

const ProviderCustom: FC<{ children: ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  
  return <PostProvider session={session}>{children}</PostProvider>;
};

export default ProviderCustom;
