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
  const [tab, setTab] = useState("active");

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
    fetchNotes(tab === "archived");
  }, [tab]);

  const handleArchiveToggle = (note) => {
    if (note.archived) {
      unarchiveNote(note.id);
    } else {
      archiveNote(note.id);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, title, content, priority);
    } else {
      addNote(title, content, priority);
    }

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

      <main className="p-6 max-w-3xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setTab("active")}
            className={`px-4 py-2 rounded-full font-medium ${
              tab === "active"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } transition`}
          >
            Active
          </button>
          <button
            onClick={() => setTab("archived")}
            className={`px-4 py-2 rounded-full font-medium ${
              tab === "archived"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } transition`}
          >
            Archived
          </button>

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
      {tab === "active" && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 active:scale-95"
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

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-400 outline-none"
            />

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
