function ThemeModal({ title, label, value, setValue, onClose, onSave,themeData  }) {
  const handleSubmit = async () => {
  await onSave(value);
  onClose();
};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <h2 className="mb-5 text-xl font-bold text-gray-900">{title}</h2>

        <label className="mb-1 block text-sm font-medium text-gray-600">
          {label}
        </label>
        <input
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={`Enter ${label.toLowerCase()}`}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            className="btn-danger"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn-primary"
            onClick={onSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThemeModal;
