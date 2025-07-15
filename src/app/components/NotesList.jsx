import { useMemo, useState } from "react";
import NoteCard from "./NoteCard";
import NoteCardSkeleton from "./NoteCardSkeleton";
import { groupNotes } from "../utils/noteGrouping";
import { motion } from "framer-motion";
import ReadNoteModal from "./ReadNoteModal";

export default function NotesList({
  notes,
  onDelete,
  onEdit,
  onArchiveToggle,
  loading,
}) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [pagination, setPagination] = useState({
    Today: 1,
    Yesterday: 1,
    Past: 1,
  });

  const grouped = useMemo(() => groupNotes(notes), [notes]);
  const ITEMS_PER_PAGE = 4;

  const shimmerArray = (count) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-[320px]">
        <NoteCardSkeleton vertical />
      </div>
    ));

  const renderSection = (category) => {
    const notesInCategory = grouped[category] || [];
    const totalPages = Math.ceil(notesInCategory.length / ITEMS_PER_PAGE);
    const currentPage = pagination[category] || 1;

    const paginatedNotes = notesInCategory.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );

    return (
      <section key={category}>
        <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-1">
          {category}
        </h3>

        <div className="flex flex-wrap gap-6 justify-center">
          {loading
            ? shimmerArray(6)
            : paginatedNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="w-[320px]"
                >
                  <NoteCard
                    note={note}
                    category={category}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onArchiveToggle={onArchiveToggle}
                    onReadMore={() => setSelectedNote(note)}
                  />
                </motion.div>
              ))}
        </div>

        {!loading && totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      [category]: pageNum,
                    }))
                  }
                  className={`px-3 py-1 rounded-full border ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border-blue-300"
                  } hover:bg-blue-500 hover:text-white transition`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <div className="space-y-12">
        {["Today", "Yesterday", "Past"].map((cat) =>
          loading || grouped[cat]?.length ? renderSection(cat) : null
        )}
      </div>

      {selectedNote && (
        <ReadNoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}
    </>
  );
}
