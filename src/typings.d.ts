declare module "react-hydration-provider" {
    import { FC, ReactNode } from "react";
  
    export const HydrationProvider: FC<{ children: ReactNode }>;
    export const Client: FC<{ children: ReactNode }>;
    // Declare other types if needed
  }
  