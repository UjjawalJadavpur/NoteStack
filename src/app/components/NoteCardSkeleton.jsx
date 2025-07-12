// components/NoteCardSkeleton.jsx
export default function NoteCardSkeleton({ vertical = false }) {
  return (
    <div
      className={`animate-pulse ${
        vertical ? "w-full" : "min-w-[400px] max-w-[450px]"
      } border border-gray-300 bg-gray-100 rounded-2xl p-4 shadow-sm`}
    >
      <div className="h-6 w-1/2 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-1/4 bg-gray-300 rounded mb-4"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
      </div>
      <div className="h-3 w-1/3 bg-gray-300 rounded mt-auto"></div>
    </div>
  );
}
