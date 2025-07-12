import { Plus } from "lucide-react";

export default function AddNoteButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-full shadow-lg transition-all duration-300 active:scale-95"
      aria-label="Add Note"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
