"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveTokenToStore } from "../utils/authUtils";
import { parseJwt } from "../utils/parseJwt";
import { TOKEN_KEY } from "../utils/constants";
import { useAuthStore } from "../zustand/useAuthStore";

export function useAuth({ guard = false } = {}) {
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

    if (!payload || payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      if (guard) router.replace("/login");
      setLoading(false);
      return;
    }

    saveTokenToStore(storedToken);
    setLoading(false);
  }, [guard, router]);

  const { token } = useAuthStore();
  return { loading, token };
}
