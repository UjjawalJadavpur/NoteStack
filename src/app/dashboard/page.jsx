"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseJwt } from "../utils/parseJwt";
import { Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import NotesList from "../components/NotesList";
import { useNotes } from "../hooks/useNotes";
import { useAuthStore } from "../zustand/useAuthStore";
import { motion, AnimatePresence } from "framer-motion";
import RichTextEditor from "../components/RichTextEditor";

export default function DashboardPage() {
  const router = useRouter();
  const { setName, setEmail } = useAuthStore();
  const {
    notes,
    loading,
    fetchNotes,
    addNote,
    deleteNote,
    updateNote,
    archiveNote,
    unarchiveNote,
  } = useNotes();

  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [tab, setTab] = useState("all");

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

  useEffect(() => {
    fetchNotes(tab); // "all" | "active" | "archived"
  }, [tab]);

  const handleArchiveToggle = async (note) => {
    if (note.archived) {
      await unarchiveNote(note.id);
    } else {
      await archiveNote(note.id);
    }
    fetchNotes(tab); // Refresh current tab
  };

  const handleSubmit = async () => {
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      await updateNote(editingNote.id, title, content, priority);
    } else {
      await addNote(title, content, priority);
    }

    await fetchNotes(tab); // Refresh current tab
    resetModal();
  };

  const resetModal = () => {
    setTitle("");
    setContent("");
    setPriority("MEDIUM");
    setIsOpen(false);
    setEditingNote(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 relative">
      <Navbar />

      <main className="p-6 max-w-full mx-auto ml-30">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          {["all", "active", "archived"].map((type) => (
            <button
              key={type}
              onClick={() => setTab(type)}
              className={`px-4 py-2 rounded-full font-medium capitalize ${
                tab === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              } transition`}
            >
              {type}
            </button>
          ))}

          {loading && (
            <span className="text-sm text-gray-500 animate-pulse ml-2">
              Loading...
            </span>
          )}
        </div>

        {/* Notes List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <NotesList
              notes={notes}
              onDelete={deleteNote}
              onEdit={(note) => {
                setEditingNote(note);
                setTitle(note.title);
                setContent(note.content);
                setPriority(note.priority || "MEDIUM");
                setIsOpen(true);
              }}
              onArchiveToggle={handleArchiveToggle}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Add Note Button */}
      {(
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-lg transition-all duration-300 active:scale-95"
          aria-label="Add Note"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-lg p-6 rounded-xl shadow-xl space-y-4 border">
            <h2 className="text-xl font-bold text-gray-800">
              {editingNote ? "Edit Note" : "Add New Note"}
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <RichTextEditor content={content} setContent={setContent} />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="HIGH">High Priority 🔴</option>
              <option value="MEDIUM">Medium Priority 🟠</option>
              <option value="LOW">Low Priority 🟢</option>
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={resetModal}
                className="px-4 py-2 text-gray-600 hover:text-red-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {editingNote ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
