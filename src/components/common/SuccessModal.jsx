function SuccessModal({ onClose , message }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl text-green-600">✓</span>
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Success
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {message}
          </p>

          <button
            onClick={onClose}
            className="mt-6 h-11 w-full rounded-2xl bg-indigo-600 font-medium text-white hover:bg-indigo-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;