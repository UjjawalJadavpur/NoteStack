"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../zustand/useAuthStore";

export function useAuthGuard() {
  const { token, setToken } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    } else {
      router.push("/login");
    }

    setLoading(false);
  }, [setToken, router]);

  return { loading, token };
}