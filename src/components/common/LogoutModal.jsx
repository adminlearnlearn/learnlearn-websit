function LogoutModal({ onClose, onConfirm }) {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl">
        <div className="mb-10 flex items-start justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Are you sure you want to log out?
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-500 hover:text-gray-900"
          >
            ×
          </button>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-600"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;