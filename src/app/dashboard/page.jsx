"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotes } from "../hooks/useNotes";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import NotesList from "../components/NotesList";
import NoteTabs from "../components/NoteTabs";
import NoteModal from "../components/NoteModal";
import AddNoteButton from "../components/AddNoteButton";

export default function DashboardPage() {
  // const { loading } = useAuth({ guard: true }); 
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

  const [tab, setTab] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes(tab);
  }, [tab]);

  const handleSubmit = async (noteData) => {
    if (editingNote) {
      await updateNote(editingNote.id, ...noteData);
    } else {
      await addNote(...noteData);
    }
    fetchNotes(tab);
    setIsOpen(false);
    setEditingNote(null);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Navbar />
      <main className="p-6">
        <NoteTabs tab={tab} setTab={setTab} loading={notesLoading} />
        <NotesList
          notes={notes}
          onDelete={deleteNote}
          onEdit={(note) => {
            setEditingNote(note);
            setIsOpen(true);
          }}
          onArchiveToggle={(note) =>
            note.archived ? unarchiveNote(note.id) : archiveNote(note.id)
          }
        />
      </main>
      <AddNoteButton onClick={() => setIsOpen(true)} />
      {isOpen && (
        <NoteModal
          onClose={() => {
            setIsOpen(false);
            setEditingNote(null);
          }}
          onSubmit={handleSubmit}
          initialNote={editingNote}
        />
      )}
    </div>
  );
}
