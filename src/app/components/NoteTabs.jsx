export default function NoteTabs({ tab, setTab, loading }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {["all", "active", "archived"].map((type) => (
        <button
          key={type}
          onClick={() => setTab(type)}
          className={`px-4 py-2 rounded-full font-medium capitalize ${
            tab === type
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } transition`}
        >
          {type}
        </button>
      ))}
      {loading && (
        <span className="text-sm text-gray-500 animate-pulse ml-2">
          Loading...
        </span>
      )}
    </div>
  );
}
