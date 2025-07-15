"use client";

import { Pencil, Trash2, Archive, ArchiveRestore } from "lucide-react";
import { exportNoteToPDF } from "../utils/exportToPdf";

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

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function NoteCard({
  note,
  category,
  onEdit,
  onDelete,
  onArchiveToggle,
  onReadMore,
}) {
  const color = categoryColors[category];
  const isLongContent = stripHtml(note.content).length > 200;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(note.createdAt));

  return (
    <div
      className={`w-[320px] border ${color.border} ${color.bg} ${
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
            onClick={(e) => {
              e.stopPropagation();
              exportNoteToPDF(note);
            }}
            className="hover:text-blue-200 transition-colors p-1"
            title="Export to PDF"
          >
            🖨️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchiveToggle(note);
            }}
            className="hover:text-purple-200 transition-colors p-1"
          >
            {note.archived ? (
              <ArchiveRestore className="w-5 h-5" />
            ) : (
              <Archive className="w-5 h-5" />
            )}
          </button>
          {!note.archived && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="hover:text-yellow-300 transition-colors p-1"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="hover:text-red-300 transition-colors p-1"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-3 flex flex-col justify-between h-[180px]">
        <div
          className="prose prose-sm max-w-none text-gray-800 mb-2 line-clamp-4 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: note.content }}
        ></div>

        {isLongContent && (
          <button
            onClick={onReadMore}
            className="text-blue-600 text-sm font-medium hover:underline self-start mb-2"
          >
            Read more...
          </button>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
          <span>{formattedDate}</span>
          {note.archived && (
            <span className="bg-gray-200 px-2 py-0.5 rounded-full text-gray-700 font-medium">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
