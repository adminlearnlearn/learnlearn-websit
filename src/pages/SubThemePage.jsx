import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  FileText,
  Gamepad2,
  Music,
  PlayCircle,
} from "lucide-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import Loader from "../components/common/loader";
import EmptyState from "../components/common/EmptyState";

function SubThemePage() {
  const navigate = useNavigate();
  const { themeId, subThemeId } = useParams();

  const [subTheme, setSubTheme] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasContent = contents.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      const subThemeSnap = await getDoc(doc(db, "subThemes", subThemeId));

      if (subThemeSnap.exists()) {
        setSubTheme({
          id: subThemeSnap.id,
          ...subThemeSnap.data(),
        });
      }

      const contentQuery = query(
        collection(db, "contents"),
        where("themeId", "==", themeId),
        where("subThemeId", "==", subThemeId),
        where("status", "==", "published"),
      );

      const contentSnap = await getDocs(contentQuery);

      const contentList = contentSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContents(contentList);
      setLoading(false);
    };

    fetchData();
  }, [themeId, subThemeId]);

  if (loading) {
    return (
      <div className="transition-opacity duration-500 opacity-100">
        <Loader />
      </div>
    );
  }

  const getIcon = (type) => {
    if (type === "story") return <PlayCircle size={42} />;
    if (type === "song") return <Music size={42} />;
    if (type === "worksheet") return <FileText size={42} />;
    if (type === "game") return <Gamepad2 size={42} />;

    return <FileText size={42} />;
  };
  const groupedContents = {
    story: contents.filter((content) => content.type === "story"),
    song: contents.filter((content) => content.type === "song"),
    worksheet: contents.filter((content) => content.type === "worksheet"),
    game: contents.filter((content) => content.type === "game"),
  };

  return (
    <main className="animate-fadeIn rounded-[2.5rem] bg-white p-10 min-h-[calc(100vh-120px)]">
      <div className="mx-auto mb-12 flex max-w-6xl items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(`/themes/${themeId}`)}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronLeft size={32} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {subTheme?.name || "Sub Theme"}
        </h1>
      </div>
      {!hasContent ? (
        <EmptyState
          title="No content found"
          message="There is no published content in this sub theme yet."
        />
      ) : (
        <div className=" mx-auto max-w-6xl space-y-16 pl-4 md:pl-18 ">
          {Object.entries(groupedContents).map(([type, items]) => {
            if (items.length === 0) return null;

            return (
              <section key={type} className="max-w-5xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="text-indigo-500">{getIcon(type)}</div>

                  <h2 className="text-2xl font-bold uppercase text-gray-900">
                    {type}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {items.map((content) => (
                    <button
                      key={content.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/themes/${themeId}/subthemes/${subThemeId}/contents/${content.id}`,
                        )
                      }
                      className="group rounded-3xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      <div className="mb-5 flex h-36 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 group-hover:text-indigo-500">
                        {content.thumbnailUrl ? (
                          <img
                            src={content.thumbnailUrl}
                            alt={content.title}
                            className="h-full w-full rounded-2xl object-cover"
                          />
                        ) : (
                          getIcon(content.type)
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900">
                        {content.title}
                      </h3>
                      {content.showNote && content.note && (
                        <div className="mt-3 px-3 py-2">
                          <p className="text-xs font-medium text-red-600">
                            {content.note}
                          </p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default SubThemePage;
