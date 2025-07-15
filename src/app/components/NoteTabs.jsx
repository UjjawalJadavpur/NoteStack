export default function NoteTabs({ tab, setTab, loading }) {
  return (
    <div className="flex items-center gap-3 mb-8 px-2">
      {["all", "active", "archived"].map((type) => (
        <button
          key={type}
          onClick={() => setTab(type)}
          className={`px-5 py-2 rounded-full font-medium capitalize transition-all duration-200
            ${tab === type
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"}
          `}
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
