function DeactivateUserModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Deactivate User</h2>

          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          Are you sure you want to deactivate this user?
        </p>

        <div className="mb-8 rounded-2xl border border-gray-200 p-4">
          <p className="font-semibold">{user.username}</p>

          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            className="h-11 rounded-xl border border-gray-300 px-5 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="h-11 rounded-xl bg-red-600 px-6 text-white"
          >
            Deactivate
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeactivateUserModal;
