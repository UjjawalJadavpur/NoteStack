"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../zustand/useAuthStore";
import { parseJwt } from "../utils/parseJwt";
import { TOKEN_KEY } from "../utils/constants";

export function useAuth({ guard = false } = {}) {
  const { token, setToken, setName, setEmail } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      if (guard) router.replace("/login");
      setLoading(false);
      return;
    }

    const payload = parseJwt(storedToken);
    
    // If token is invalid or expired
    if (!payload || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      if (guard) router.replace("/login");
      setLoading(false);
      return;
    }

    // Valid token
    setToken(storedToken);
    if (payload.name) setName(payload.name);
    if (payload.email) setEmail(payload.email);
    
    setLoading(false);
  }, [guard, router, setToken, setName, setEmail]);

  return { loading, token };
}
