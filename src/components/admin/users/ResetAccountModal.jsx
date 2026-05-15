function ResetAccountModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Reset Account</h2>

          <button
            onClick={onClose}
            className="close-btn text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-100 bg-gray-50/80 p-5">
          <div className="grid gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Email
              </p>
              <p className="mt-1 font-semibold text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                School
              </p>
              <p className="font-semibold  text-gray-900"> {user.school}</p>
            </div>

            <div className=" w-full max-w-[320px] flex items-center justify-between border-t border-gray-200/70 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Status
              </p>
              
            </div>
            <span
              className={`inline-flex items-center gap-2 text-sm font-medium ${
                user.status === "active" ? "text-green-600" : " text-red-600 "
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  user.status === "active" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              {user.isLocked === "active" ? "Locked" : "Locked"}
            </span>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            className="h-11 rounded-xl border border-gray-300 px-5 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-11 rounded-xl bg-indigo-600 px-6 font-medium text-white hover:bg-indigo-700"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetAccountModal;
