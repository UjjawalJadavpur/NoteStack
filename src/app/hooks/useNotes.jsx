import { useState } from "react";
import api from "../lib/api";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotes(showArchived = false) {
    setLoading(true);
    try {
      const url = showArchived ? "/notes/archived" : "/notes";
      const res = await api.get(url);
      setNotes((prev) => res.data); // smoother transition
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function archiveNote(id) {
    try {
      await api.put(`/notes/${id}/archive`);
      await fetchNotes(false);
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  }

  async function unarchiveNote(id) {
    try {
      await api.put(`/notes/${id}/unarchive`);
      await fetchNotes(true);
    } catch (err) {
      console.error("Failed to unarchive note:", err);
    }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`);
      await fetchNotes();
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  async function addNote(title, content, priority = "MEDIUM") {
    if (!title || !content) return;
    try {
      await api.post("/notes", { title, content, priority });
      await fetchNotes(false);
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  }

  async function updateNote(id, title, content, priority = "MEDIUM") {
    if (!title || !content) return;
    try {
      await api.put(`/notes/${id}`, { title, content, priority });
      await fetchNotes();
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  }

  return {
    notes,
    loading,
    fetchNotes,
    addNote,
    deleteNote,
    updateNote,
    archiveNote,
    unarchiveNote,
  };
}
