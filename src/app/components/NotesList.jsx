"use client";

import { Trash2, Pencil, ArchiveRestore, Archive } from "lucide-react";
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
  return notes
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Newest first
    .reduce((groups, note) => {
      const category = getNoteCategory(note.createdAt);
      if (!groups[category]) groups[category] = [];
      groups[category].push(note);
      return groups;
    }, {});
}

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

export default function NotesList({ notes, onDelete, onEdit, onArchiveToggle }) {
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
                    className={`relative border ${color.border} ${color.bg} ${
                      note.archived ? "opacity-50" : ""
                    } p-0 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300`}
                  >
                    {/* Header */}
                    <div
                      className={`px-4 py-2 rounded-t-2xl ${color.gradient} ${color.text} flex justify-between items-center shadow-inner`}
                    >
                      <h2 className="text-lg font-semibold truncate max-w-[60%]">
                        {note.title || "Untitled"}
                      </h2>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            note.priority === "HIGH"
                              ? "bg-red-100 text-red-600"
                              : note.priority === "LOW"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {note.priority}
                        </span>
                        <button
                          onClick={() => onArchiveToggle(note)}
                          className="hover:text-purple-200 transition-colors p-1"
                          aria-label={`Archive toggle for note ${note.title}`}
                        >
                          {note.archived ? (
                            <ArchiveRestore className="w-5 h-5" />
                          ) : (
                            <Archive className="w-5 h-5" />
                          )}
                        </button>
                        {!note.archived && (
                          <button
                            onClick={() => onEdit(note)}
                            className="hover:text-yellow-300 transition-colors p-1"
                            aria-label={`Edit note ${note.title}`}
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(note.id)}
                          className="hover:text-red-300 transition-colors p-1"
                          aria-label={`Delete note ${note.title}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 py-3 space-y-1">
                      <p className="text-gray-800 whitespace-pre-line">
                        {note.content || "(No content)"}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                        <span>{formattedDate}</span>
                        {note.archived && (
                          <span className="bg-gray-200 px-2 py-0.5 rounded-full text-gray-700 font-medium text-xs">
                            Archived
                          </span>
                        )}
                      </div>
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
