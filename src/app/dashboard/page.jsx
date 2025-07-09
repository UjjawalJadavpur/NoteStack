"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseJwt } from "../utils/parseJwt";

import Navbar from "../components/Navbar";
import NotesList from "../components/NotesList";
import { useNotes } from "../hooks/useNotes";
import { useAuthStore } from "../zustand/useAuthStore";
import { Plus } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { setName, setEmail } = useAuthStore();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { notes, loading, addNote, deleteNote } = useNotes();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
      return;
    }

    const payload = parseJwt(storedToken);
    if (payload?.name) setName(payload.name);
    if (payload?.email || payload?.sub) setEmail(payload.email || payload.sub);
  }, [router, setName, setEmail]);

  if (loading) return <p className="p-6 text-center text-gray-600">Loading notes...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Navbar />

      <main className="p-6 max-w-3xl mx-auto">
        <div className="mb-6 bg-white p-5 rounded-xl shadow-md space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            onClick={() => {
              if (!title.trim() && !content.trim()) return;
              addNote(title, content);
              setTitle("");
              setContent("");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Note
          </button>
        </div>

        <NotesList notes={notes} onDelete={deleteNote} />
      </main>
    </div>
  );
}
