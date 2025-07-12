"use client";

import { useAuth } from "./hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { loading, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      router.replace(token ? "/dashboard" : "/login");
    }
  }, [loading, token, router]);

  return (
    <div className="h-screen flex items-center justify-center text-gray-500">
      Loading…
    </div>
  );
}
