import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Image as ImageIcon } from "lucide-react";
import Loader from "../components/common/loader";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import EmptyState from "../components/common/EmptyState";

function Themes() {
  const navigate = useNavigate();
  const { themeId } = useParams();

  const [theme, setTheme] = useState(null);
  const [subThemes, setSubThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasSubThemes  = subThemes.length > 0;


  useEffect(() => {
    const fetchSubThemes = async () => {
      const themeSnap = await getDoc(doc(db, "themes", themeId));
      if (themeSnap.exists()) {
        setTheme({ id: themeSnap.id, ...themeSnap.data() });
      }
      const subThemeQuery = query(
        collection(db, "subThemes"),
        where("themeId", "==", themeId),
      );
      const subThemeSnap = await getDocs(subThemeQuery);
      const subThemeList = subThemeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubThemes(subThemeList);
      setLoading(false);
    };

    fetchSubThemes();
  }, [themeId]);
  if (loading) {
    return (
      <div className="transition-opacity duration-500 opacity-100">
        <Loader />
      </div>
    );
  }
  return (
    <main className=" animate-fadeIn rounded-[2.5rem] bg-white p-14 min-h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="mx-auto mb-14 flex max-w-6xl items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <ChevronLeft size={32} />
        </button>

        <h1 className="text-3xl font-bold text-gray-900">
          {theme?.name || "Theme"}
        </h1>
      </div>

      {/* Grid */}
      {!hasSubThemes  ? (
        <EmptyState
          title="No sub themes found"
          message="There are no sub themes available for this theme yet."
        />
      ) : (
        <div className="grid max-w-5xl grid-cols-3 gap-x-28 gap-y-14 justify-items-center">
          {subThemes.map((subTheme, index) => (
            <button
              key={subTheme.id}
              onClick={() =>
                navigate(`/themes/${themeId}/subthemes/${subTheme.id}`)
              }
              type="button"
              className={`group flex flex-col items-center text-center
                        ${subThemes.length === 4 && index === 3 ? "col-start-2" : ""}
                        ${subThemes.length === 5 && index === 3 ? "col-start-1 translate-x-24" : ""}
                        ${subThemes.length === 5 && index === 4 ? "col-start-3 -translate-x-24" : ""}
                        `}
            >
              {/* Card */}
              <div className="flex h-36 w-36 items-center justify-center rounded-2xl border border-gray-300 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                {subTheme.imageUrl ? (
                  <img
                    src={subTheme.imageUrl}
                    alt={subTheme.name}
                    className="h-full w-full rounded-3xl object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center bg-gray-200 text-gray-400">
                    <ImageIcon size={54} />
                  </div>
                )}
              </div>

              <p className="mt-4 text-base font-bold text-gray-900">
                {subTheme.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}

export default Themes;
