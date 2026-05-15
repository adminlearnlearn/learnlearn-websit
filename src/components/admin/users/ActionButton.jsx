function ActionButton({ icon, text, color, onClick, disabled }) {
  const colorMap = {
    blue: "border-blue-500 text-blue-600 hover:bg-blue-50",
    indigo: "border-indigo-500 text-indigo-600 hover:bg-indigo-50",
    yellow: "border-yellow-400 text-yellow-500 hover:bg-yellow-50",
    red: "border-red-500 text-red-500 hover:bg-red-50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-9 border rounded-lg flex items-center justify-center gap-2 text-sm ${colorMap[color]} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {icon}
      {text}
    </button>
  );
}

export default ActionButton;
