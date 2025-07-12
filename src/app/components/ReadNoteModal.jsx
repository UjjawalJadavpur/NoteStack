"use client";

import TextToSpeechButton from "./TextToSpeechButton";

export default function ReadNoteModal({ note, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white max-w-2xl w-full rounded-xl p-6 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">{note.title || "Untitled"}</h2>
          <TextToSpeechButton rawText={note.title + ". " + note.content} />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="font-medium">
              Priority:{" "}
              <span
                className={`inline-block px-2 py-1 rounded-full ${
                  note.priority === "HIGH"
                    ? "bg-red-100 text-red-600"
                    : note.priority === "LOW"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {note.priority}
              </span>
            </span>
            <span>
              {new Intl.DateTimeFormat("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              }).format(new Date(note.createdAt))}
            </span>
          </div>

          <div
            className="max-h-[50vh] overflow-y-auto text-gray-800 border rounded-md p-4 bg-gray-50 prose prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: note.content }}
          ></div>
        </div>
      </div>
    </div>
  );
}
