"use client";

import { Trash2 } from "lucide-react";
import { motion } from "framer-motion";

function getNoteCategory(dateStr) {
  const noteDate = new Date(dateStr);
  const today = new Date();

  const noteDay = noteDate.toDateString();
  const todayDay = today.toDateString();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayDay = yesterday.toDateString();

  if (noteDay === todayDay) return "Today";
  if (noteDay === yesterdayDay) return "Yesterday";
  return "Past";
}

function groupNotes(notes) {
  return notes.reduce((groups, note) => {
    const category = getNoteCategory(note.createdAt);
    if (!groups[category]) groups[category] = [];
    groups[category].push(note);
    return groups;
  }, {});
}

// Gradient category header styles
const categoryColors = {
  Today: {
    bg: "bg-green-50",
    border: "border-green-300",
    gradient: "bg-gradient-to-r from-green-600 to-emerald-500",
    text: "text-white",
  },
  Yesterday: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    gradient: "bg-gradient-to-r from-yellow-500 to-orange-400",
    text: "text-white",
  },
  Past: {
    bg: "bg-gray-50",
    border: "border-gray-300",
    gradient: "bg-gradient-to-r from-gray-700 to-gray-600",
    text: "text-white",
  },
};

export default function NotesList({ notes, onDelete }) {
  if (notes.length === 0) {
    return <p className="text-gray-500 text-center italic">No notes available.</p>;
  }

  const grouped = groupNotes(notes);

  return (
    <div className="space-y-10">
      {["Today", "Yesterday", "Past"].map((category) =>
        grouped[category] ? (
          <section key={category}>
            <h3 className="text-xl font-bold text-gray-700 border-b pb-1 mb-4">{category}</h3>
            <div className="grid grid-cols-1 gap-4">
              {grouped[category].map((note, index) => {
                const date = new Date(note.createdAt);
                const formattedDate = new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(date);

                const color = categoryColors[category];

                return (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`relative border ${color.border} ${color.bg} p-0 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    {/* Header */}
                    <div
                      className={`px-4 py-2 rounded-t-2xl ${color.gradient} ${color.text} flex justify-between items-center shadow-inner`}
                    >
                      <h2 className="text-lg font-semibold truncate max-w-[80%]">
                        {note.title || "Untitled"}
                      </h2>
                      <button
                        onClick={() => onDelete(note.id)}
                        className="text-white hover:text-red-300 transition-colors p-1"
                        aria-label={`Delete note ${note.title}`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-3">
                      <p className="text-gray-800 whitespace-pre-line mb-4">
                        {note.content || "(No content)"}
                      </p>
                      <p className="text-xs text-gray-500 text-right">{formattedDate}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
}
