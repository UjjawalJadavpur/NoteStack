import { useCallback, useState } from "react";
import api from "../lib/api";

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async (type = "all") => {
    setLoading(true);
    try {
      let url = "/notes";
      if (type === "active") url = "/notes/active";
      else if (type === "archived") url = "/notes/archived";

      const res = await api.get(url);
      console.log("✅ Notes fetched:", res.data);
      setNotes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  async function archiveNote(id) {
    try {
      await api.put(`/notes/${id}/archive`);
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  }

  async function unarchiveNote(id) {
    try {
      await api.put(`/notes/${id}/unarchive`);
    } catch (err) {
      console.error("Failed to unarchive note:", err);
    }
  }

  async function deleteNote(id) {
    try {
      await api.delete(`/notes/${id}`);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  async function addNote(title, content, priority = "MEDIUM") {
    if (!title || !content) return;
    try {
      await api.post("/notes", { title, content, priority });
    } catch (err) {
      console.error("Failed to add note:", err);
    }
  }

  async function updateNote(id, title, content, priority = "MEDIUM") {
    if (!title || !content) return;
    try {
      await api.put(`/notes/${id}`, { title, content, priority });
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
