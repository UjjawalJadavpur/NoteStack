"use client";
import AuthForm from "../components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 animate-fade-in">
      {/* Branding */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">NoteStack</h1>
        {/* <p className="text-gray-500 text-sm mt-1">Your personal project note organizer</p> */}
      </div>

      <AuthForm />
    </div>
  );
}
