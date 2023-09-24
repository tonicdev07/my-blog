"use client";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import React, { FC, ReactNode, useEffect, useState } from "react";
// import { ReactQueryDevtools } from "react-query-devtools";
import { HydrationProvider, Client } from "react-hydration-provider";
import ProviderCustom from "./providerCustom";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Provider: FC<{ children: ReactNode }> = ({ children }) => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SessionProvider>
      <HydrationProvider>
        <Client>
          <QueryClientProvider client={queryClient}>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
            >
              <ProviderCustom>{children}</ProviderCustom>
            </ThemeProvider>
          </QueryClientProvider>
        </Client>
      </HydrationProvider>
    </SessionProvider>
  );
};

export default Provider;
