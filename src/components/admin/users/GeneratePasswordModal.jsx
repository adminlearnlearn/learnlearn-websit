import { X, RefreshCw } from "lucide-react";
import { Clipboard, Check } from "lucide-react";
import { useState } from "react";

function GeneratePasswordModal({
  user,
  password,
  onGenerate,
  onClose,
  onSendLink,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopyPassword = async () => {
    await navigator.clipboard.writeText(password);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-3xl font-bold text-gray-900">
            Generate Password
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex gap-10 text-xl">
            <span className="w-24 font-medium text-gray-900">Email :</span>
            <span className="text-gray-400">{user?.email}</span>
          </div>

          <div className="flex gap-10 text-xl">
            <span className="w-24 font-medium text-gray-900">School :</span>
            <span className="text-gray-400">{user?.school}</span>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Generate
          </label>

          <div className="relative">
            <input
              type="text"
              value={password}
              readOnly
              className="h-12 w-full rounded-2xl border border-gray-300 pr-24 pl-4 outline-none focus:border-indigo-500"
            />

            <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
              {/* Copy */}
              <button
                type="button"
                onClick={handleCopyPassword}
                className="text-gray-500 transition hover:text-indigo-600"
              >
                {copied ? <Check size={18} /> : <Clipboard size={18} />}
              </button>

              {/* Generate */}
              <button
                type="button"
                onClick={onGenerate}
                className="text-gray-500 transition hover:text-indigo-600"
              >
                <RefreshCw size={18} />
              </button>
            </div>

          </div>
        </div>

        <div className="mt-28 flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-300 px-5 py-3 font-medium text-white hover:bg-gray-400"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSendLink}
            className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default GeneratePasswordModal;
