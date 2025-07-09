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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Left - Welcome */}
      <div className="text-xl font-bold text-gray-700">
        Welcome, <span className="text-blue-600">{name || "User"}</span>
      </div>

      {/* Right - Brand + Dropdown */}
      <div className="flex items-center gap-4 relative">
        <div className="text-lg font-bold text-blue-600">NoteStack</div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            <User className="h-5 w-5" />
            <ChevronDown className="h-4 w-4" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg z-20 border overflow-hidden divide-y divide-gray-200 transition-all duration-200 origin-top-right">
              {/* User Info */}
              <div className="px-4 py-3">
                <p className="font-medium text-gray-800 truncate">{name}</p>
                <p className="text-sm text-gray-500 truncate">{email}</p>
              </div>

              {/* Change Password */}
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm"
                onClick={() => alert("Change password feature coming soon!")}
              >
                Change Password
              </button>

              {/* Logout */}
              <button
                className="w-full text-left px-4 py-3 hover:bg-gray-50 text-sm text-red-600 font-semibold"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
