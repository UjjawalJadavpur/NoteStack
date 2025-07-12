"use client";

import { useRouter } from "next/navigation";
import { logout } from "../lib/logout";

export function useLogout() {
  const router = useRouter();

  return () => logout(router);
}
