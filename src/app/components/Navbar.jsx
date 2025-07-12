"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronDown } from "lucide-react";
import { useAuthStore } from "../zustand/useAuthStore";

export default function Navbar() {
  const router = useRouter();
  const { name, email, reset } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function logout() {
    localStorage.removeItem("token");
    reset();
    router.push("/login");
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center border-b border-gray-200">
      {/* Left - Welcome */}
      <div className="text-xl font-semibold text-gray-800">
        Welcome, <span className="text-blue-600">{name || "User"}</span>
      </div>

      {/* Right - Brand + Dropdown */}
      <div className="flex items-center gap-6 relative">
        <div className="text-lg font-bold text-blue-700 tracking-wide">NoteStack</div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <User className="h-5 w-5 text-gray-600" />
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </button>

          {/* Dropdown */}
          <div
            className={`absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-20 transition-all duration-200 transform origin-top-right ${
              dropdownOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            {/* User Info */}
            <div className="px-4 py-3 bg-gray-50 border-b">
              <p className="font-semibold text-gray-800 truncate">{name}</p>
              <p className="text-sm text-gray-500 truncate">{email}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col">
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm text-gray-700 transition"
                onClick={() => alert("Change password feature coming soon!")}
              >
                Change Password
              </button>

              <button
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-semibold transition"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
