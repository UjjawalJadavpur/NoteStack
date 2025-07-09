import { useState, useEffect } from "react";
import api from "../lib/api";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchNotes() {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  }

  async function addNote(title, content) {
    if (!title || !content) return;
    try {
      await api.post("/notes", { title, content });
      await fetchNotes();
    } catch (err) {
      console.error("Failed to add note:", err);
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

  useEffect(() => {
    fetchNotes();
  }, []);

  return { notes, loading, addNote, deleteNote };
}
