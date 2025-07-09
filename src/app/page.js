"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./zustand/useAuthStore";
import { parseJwt } from "./utils/parseJwt";

export default function Home() {
  const { token, setToken, setName, setEmail } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const payload = parseJwt(storedToken);

      if (payload?.name) setName(payload.name);
      if (payload?.email) setEmail(payload.email);

      router.push(`/dashboard`);
    } else {
      router.push("/login");
    }

    setLoading(false);
  }, [setToken, setName, setEmail, router]);

  if (loading) return null;
  return null; // Nothing to render — user is being redirected
}
