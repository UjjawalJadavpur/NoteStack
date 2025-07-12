import AuthForm from "./components/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 bg-gradient-to-br from-indigo-50 to-white">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-indigo-800 tracking-tight drop-shadow-md">
          NoteStack
        </h1>
        <p className="text-gray-500 text-sm mt-2 italic">
          Your personal project note organizer.
        </p>
      </div>
      <AuthForm />
    </div>
  );
}
