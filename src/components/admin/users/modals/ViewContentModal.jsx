function ViewContentModal({ content, onClose }) {
  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[95vw] max-w-4xl rounded-3xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-indigo-500">
              {content.type}
            </p>

            <h2 className="text-2xl font-bold text-gray-900">
              {content.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
          >
            Close
          </button>
        </div>

        {/* Note */}
        {content.showNote && content.note && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">{content.note}</p>
          </div>
        )}

        {/* Story / Song */}
        {(content.type === "story" || content.type === "song") && (
          <video
            controls
            src={content.fileUrl}
            className="w-full rounded-2xl bg-black"
          />
        )}

        {/* Worksheet */}
        {content.type === "worksheet" && (
          <iframe
            src={content.fileUrl}
            title={content.title}
            className="h-[75vh] w-full rounded-2xl"
          />
        )}

        {/* Game */}
        {content.type === "game" && (
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            {content.contentUrl ? (
              <iframe
                src={content.contentUrl}
                title={content.title || "Game"}
                className="h-[70vh] min-h-[500px] w-full"
                allow="fullscreen; autoplay; clipboard-write"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <div className="flex h-[350px] items-center justify-center text-gray-400">
                Game URL not found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewContentModal;
