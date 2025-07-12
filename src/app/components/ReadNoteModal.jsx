"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import TextToSpeechButton from "./TextToSpeechButton";

export default function ReadNoteModal({ note, onClose }) {
  return (
    <Transition appear show={!!note} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white max-w-2xl w-full rounded-xl p-6 shadow-xl text-left space-y-4 relative">
                <Dialog.Title as="h2" className="text-2xl font-bold text-gray-800">
                  {note?.title || "Untitled"}
                </Dialog.Title>

                <TextToSpeechButton rawText={note?.title + ". " + note?.content} />

                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-medium">
                    Priority:
                    <span
                      className={`ml-2 inline-block px-2 py-1 rounded-full ${
                        note?.priority === "HIGH"
                          ? "bg-red-100 text-red-600"
                          : note?.priority === "LOW"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                      }`}
                    >
                      {note?.priority}
                    </span>
                  </span>
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(note?.createdAt))}
                  </span>
                </div>

                <div
                  className="max-h-[50vh] overflow-y-auto text-gray-800 border rounded-md p-4 bg-gray-50 prose prose-base max-w-none"
                  dangerouslySetInnerHTML={{ __html: note?.content }}
                />

                <div className="flex justify-end pt-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-red-500 transition"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
