import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function LearningContent() {
  const navigate = useNavigate();
  const { themeId, subThemeId, contentId } = useParams();

  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      const contentSnap = await getDoc(doc(db, "contents", contentId));

      if (contentSnap.exists()) {
        setContent({
          id: contentSnap.id,
          ...contentSnap.data(),
        });
      }
    };

    fetchContent();
  }, [contentId]);

  if (!content) {
    return (
      <main className="rounded-[2.5rem] bg-white p-10">
        <p className="text-gray-400">Loading content...</p>
      </main>
    );
  }

  return (
    <main className="rounded-[2.5rem] bg-white p-10 min-h-[calc(100vh-120px)]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/themes/${themeId}/subthemes/${subThemeId}`)}
            className="rounded-full p-2 hover:bg-gray-100"
          >
            <ChevronLeft size={32} />
          </button>

          <div>
            <p className="text-sm font-semibold uppercase text-indigo-500">
              {content.type}
            </p>
            <h1 className="text-3xl font-bold text-gray-900">
              {content.title}
            </h1>
          </div>
        </div>

        {content.showNote && content.note && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
            <p className="text-sm font-semibold text-red-600">
              {content.note}
            </p>
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          {(content.type === "story" || content.type === "song") && (
            <video
              controls
              className="w-full rounded-2xl bg-black"
              src={content.fileUrl}
            />
          )}

          {content.type === "worksheet" && (
            <iframe
              src={content.fileUrl}
              title={content.title}
              className="h-[75vh] w-full rounded-2xl bg-white"
            />
          )}

          {content.type === "game" && (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-lg font-semibold text-gray-700">
                Click below to start the game
              </p>

              <a
                href={content.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              >
                Start Game
                <ExternalLink size={18} />
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default LearningContent;