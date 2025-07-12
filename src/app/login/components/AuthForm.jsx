"use client";

import React, { useState } from "react";
import PasswordField from "./PasswordField";
import InputField from "./InputField";
import { handleAuth } from "@/app/lib/handleAuth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitAuth = async () => {
    if (loading) return; // Prevent if already loading
    setLoading(true);
    setError("");

    try {
      await handleAuth(mode, formData, router, setError);
    } finally {
      setLoading(false);
    }
  };

  const modes = ["login", "register"];

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-xl shadow-lg p-8 space-y-6 transition-all animate-fade-in">
      {/* Mode Switcher */}
      <div className="flex rounded-full overflow-hidden border border-gray-200 shadow-inner text-sm font-semibold">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`w-1/2 py-2 transition-colors ${
              mode === m
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {m === "login" ? "Sign In" : "Sign Up"}
          </button>
        ))}
      </div>

      {/* Headings */}
      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {mode === "login" ? "Welcome Back 👋" : "Create Your Account"}
        </h2>
        <p className="text-sm text-gray-500">
          {mode === "login"
            ? "Organize your thoughts, build your dreams."
            : "Get started organizing your project notes."}
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-4">
        {mode === "register" && (
          <InputField
            name="name"
            placeholder="Username"
            value={formData.name || ""}
            onChange={handleChange}
          />
        )}

        <InputField
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <PasswordField
          show={showPassword}
          toggle={() => setShowPassword((s) => !s)}
          value={formData.password}
          onChange={handleChange}
          onEnter={submitAuth}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={submitAuth}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold shadow transition-colors ${
          loading
            ? "bg-gray-300 text-white cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
       {loading ? "Loading..." : mode === "login" ? "Log In" : "Sign Up"}
      </button>
    </div>
  );
}
