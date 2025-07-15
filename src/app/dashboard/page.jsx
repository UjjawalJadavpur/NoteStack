"use client";

import { useState, useCallback } from "react";
import { useNotes } from "../hooks/useNotes";
import { useDebouncedEffect } from "../hooks/useDebouncedEffect";
import Navbar from "../components/Navbar";
import NotesList from "../components/NotesList";
import NoteTabs from "../components/NoteTabs";
import NoteModal from "../components/NoteModal";
import AddNoteButton from "../components/AddNoteButton";

export default function DashboardPage() {
  const {
    notes,
    loading: notesLoading,
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

  const fetchNotesForTab = useCallback(() => {
  fetchNotes(tab);
}, [tab, fetchNotes]);

useDebouncedEffect(fetchNotesForTab, [fetchNotesForTab], 300);


  const handleCloseModal = () => {
    setIsOpen(false);
    setEditingNote(null);
  };

  const handleEdit = useCallback((note) => {
    setEditingNote(note);
    setIsOpen(true);
  }, []);

  const handleSubmit = async ([title, content, priority]) => {
    if (editingNote) {
      await updateNote(editingNote.id, title, content, priority);
    } else {
      await addNote(title, content, priority);
    }
    fetchNotes(tab);
    handleCloseModal();
  };

  const handleArchiveToggle = useCallback(
    (note) => {
      note.archived ? unarchiveNote(note.id) : archiveNote(note.id);
    },
    [archiveNote, unarchiveNote]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <Navbar />
      <main className="p-6">
        <NoteTabs tab={tab} setTab={setTab} loading={notesLoading} />

        {notesLoading ? (
          <div className="flex justify-center items-center h-40 text-gray-400">
            Loading notes...
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">No notes to show.</div>
        ) : (
          <NotesList
            notes={notes}
            onEdit={handleEdit}
            onDelete={deleteNote}
            onArchiveToggle={handleArchiveToggle}
          />
        )}
      </main>

      <AddNoteButton onClick={() => setIsOpen(true)} />
      {isOpen && (
        <NoteModal
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          initialNote={editingNote}
        />
      )}
    </div>
  );
}
