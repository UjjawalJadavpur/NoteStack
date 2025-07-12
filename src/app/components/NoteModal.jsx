"use client";
import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";

export default function NoteModal({ onClose, onSubmit, initialNote = null }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || "");
      setContent(initialNote.content || "");
      setPriority(initialNote.priority || "MEDIUM");
    }
  }, [initialNote]);

  const handleSubmit = () => {
    if (!title.trim() && !content.trim()) return;
    onSubmit([title, content, priority]);
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialNote ? "Edit Note" : "Add New Note"}
        </h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <RichTextEditor content={content} setContent={setContent} />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="HIGH">High Priority 🔴</option>
          <option value="MEDIUM">Medium Priority 🟠</option>
          <option value="LOW">Low Priority 🟢</option>
        </select>
        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-red-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            {initialNote ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
