"use client";

import { useAuth } from "../hooks/useAuth";

export default function DashboardLayout({ children }) {
  const { loading } = useAuth({ guard: true });

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Authenticating...
      </div>
    );
  }

  return <>{children}</>;
}
