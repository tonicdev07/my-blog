"use client";

import { usePost } from "@/context/context";

export function useUser() {
  const { session } = usePost() as any;  
  return { id:session?.user?.id };
}
