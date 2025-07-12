"use client";

import { useState, useEffect, Fragment } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Transition, TransitionChild } from "@headlessui/react";
import toast from "react-hot-toast";
import RichTextEditor from "./RichTextEditor";
import { useAISuggestion } from "../hooks/useAISuggestion";
import AISuggestionModal from "./AISuggestionModal";

export default function NoteModal({ onClose, onSubmit, initialNote = null }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState("MEDIUM");

  const [aiSuggestion, setAISuggestion] = useState("");
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);

  const { loading: aiLoading, getSuggestion } = useAISuggestion();

  useEffect(() => {
    if (initialNote) {
      setTitle(initialNote.title || "");
      setContent(initialNote.content || "");
      setPriority(initialNote.priority || "MEDIUM");
    } else {
      setTitle("");
      setContent("");
      setPriority("MEDIUM");
    }
  }, [initialNote]);

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) return toast.error("Title is required.");
    if (!trimmedContent) return toast.error("Content cannot be empty.");

    onSubmit([trimmedTitle, trimmedContent, priority]);
  };

  return (
    <Transition show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-6 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all space-y-4">
                <DialogTitle as="h3" className="text-xl font-semibold text-gray-800">
                  {initialNote ? "Edit Note" : "Add New Note"}
                </DialogTitle>

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

                <button
                  onClick={() =>
                    getSuggestion({
                      title,
                      content,
                      onSuccess: (suggestion) => {
                        setAISuggestion(suggestion);
                        setShowSuggestionModal(true);
                      },
                    })
                  }
                  disabled={aiLoading}
                  className="text-sm text-blue-600 underline mt-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {aiLoading && (
                    <svg
                      className="animate-spin h-4 w-4 text-blue-600"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      ></path>
                    </svg>
                  )}
                  ✨ Suggest Improvements with AI
                </button>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-red-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {initialNote ? "Update" : "Save"}
                  </button>
                </div>

                {/* AI Suggestion Modal */}
                <AISuggestionModal
                  suggestion={aiSuggestion}
                  open={showSuggestionModal}
                  onClose={() => setShowSuggestionModal(false)}
                  onInsert={() => {
                    setContent(aiSuggestion);
                    setShowSuggestionModal(false);
                  }}
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
