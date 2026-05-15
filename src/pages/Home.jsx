import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Home() {
  const [themes, setThemes] = useState([]);
  useEffect(() => {
    const fetchThemes = async () => {
      const snapshot = await getDocs(collection(db, "themes"));

      const themeList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setThemes(themeList);
    };

    fetchThemes();
  }, []);

  return (
    <main  className="rounded-3xl pt-2 py-10 bg-white p-8 shadow-sm">
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Theme</h2>
      <div className="grid grid-cols-1 justify-items-center gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className="group flex flex-col items-center text-center"
          >
            <div
              className="
                flex h-52 w-full max-w-[300px]
                items-center justify-center
                rounded-[2rem]
                border border-gray-200
                bg-white
                shadow-sm
                group-hover:-translate-y-1
                group-hover:shadow-xl
                transition-all duration-300
                hover:scale-[1.02]
                "
            >
              {theme.imageUrl ? (
                <img
                  src={theme.imageUrl}
                  alt={theme.name}
                  className="h-full w-full rounded-[2rem] object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-gray-200 text-gray-400">
                  Image
                </div>
              )}
            </div>

            <p className="mt-6 text-lg font-bold text-gray-900">{theme.name}</p>
          </button>
        ))}
      </div>
    </main >
  );
}

export default Home;
