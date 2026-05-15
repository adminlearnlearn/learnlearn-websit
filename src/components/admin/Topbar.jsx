function Topbar({ onMenuClick }) {
  return (
    <div className="flex items-center justify-between bg-white px-4 py-4 border-b border-gray-200 md:px-8">
      <div className="flex items-center gap-3">
        <button
          className="rounded-lg border border-gray-300 px-3 py-2 md:hidden"
          onClick={onMenuClick}
        >
          ☰
        </button>
      </div>

      <div>Admin </div>
    </div>
  );
}

export default Topbar;
