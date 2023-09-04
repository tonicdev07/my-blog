"use client";

import { usePost } from "@/context/context";

export function useUser() {
  const { session } = usePost();  
  return { id:session?.user?.id };
}
