import { useMemo, useState } from "react";
import NoteCard from "./NoteCard";
import NoteCardSkeleton from "./NoteCardSkeleton";
import { groupNotes } from "../utils/noteGrouping";
import { motion } from "framer-motion";
import ReadNoteModal from "./ReadNoteModal";


// Add loading as prop
export default function NotesList({
  notes,
  onDelete,
  onEdit,
  onArchiveToggle,
  loading,
}) {
  const [selectedNote, setSelectedNote] = useState(null);
  const [pastPage, setPastPage] = useState(1);

  const grouped = useMemo(() => groupNotes(notes), [notes]);
  const ITEMS_PER_PAGE = 6;

  const shimmerArray = (count) =>
    Array.from({ length: count }).map((_, i) => <NoteCardSkeleton key={i} />);

  const renderHorizontalSection = (category) => (
    <section key={category}>
      <h3 className="text-xl font-bold text-gray-700 mb-2">{category}</h3>
      <div className="flex gap-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
        {loading
          ? shimmerArray(4)
          : grouped[category]?.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="snap-start"
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
    </section>
  );

  const renderPaginatedSection = () => {
    const pastNotes = grouped["Past"] || [];
    const totalPages = Math.ceil(pastNotes.length / ITEMS_PER_PAGE);
    const paginatedNotes = pastNotes.slice(
      (pastPage - 1) * ITEMS_PER_PAGE,
      pastPage * ITEMS_PER_PAGE
    );

    return (
      <section key="Past">
        <h3 className="text-xl font-bold text-gray-700 mb-2">Past</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? shimmerArray(6).map((skeleton, i) => (
                <div key={i}>
                  <NoteCardSkeleton vertical />
                </div>
              ))
            : paginatedNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <NoteCard
                    note={note}
                    category="Past"
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
                  onClick={() => setPastPage(pageNum)}
                  className={`px-3 py-1 rounded-full border ${
                    pastPage === pageNum
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
      <div className="space-y-10">
        {["Today", "Yesterday"].map((cat) =>
          loading || grouped[cat] ? renderHorizontalSection(cat) : null
        )}
        {loading || grouped["Past"] ? renderPaginatedSection() : null}
      </div>

      {selectedNote && (
        <ReadNoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      )}
    </>
  );
}
