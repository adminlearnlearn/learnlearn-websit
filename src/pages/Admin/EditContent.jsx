import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import FormError from "../../components/common/FormError";

function EditContent() {
  const [contentUrl, setContentUrl] = useState("");
  const { contentId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("draft");
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedSubTheme, setSelectedSubTheme] = useState("");
  const [themes, setThemes] = useState([]);
  const [subThemes, setSubThemes] = useState([]);
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const contentSnap = await getDoc(doc(db, "contents", contentId));
      const themeSnap = await getDocs(collection(db, "themes"));

      if (contentSnap.exists()) {
        const data = contentSnap.data();

        setTitle(data.title || "");
        setType(data.type || "");
        setStatus(data.status || "draft");
        setSelectedTheme(data.themeId || "");
        setSelectedSubTheme(data.subThemeId || "");
        setShowNote(data.showNote || false);
        setNote(data.note || "");
        setContentUrl(data.contentUrl || "");
      }

      const themeList = themeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setThemes(themeList);
    };

    fetchData();
  }, [contentId]);

  useEffect(() => {
    const fetchSubThemes = async () => {
      if (!selectedTheme) {
        setSubThemes([]);
        return;
      }

      const subThemeQuery = query(
        collection(db, "subThemes"),
        where("themeId", "==", selectedTheme),
      );

      const subThemeSnap = await getDocs(subThemeQuery);

      const subThemeList = subThemeSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSubThemes(subThemeList);
    };

    fetchSubThemes();
  }, [selectedTheme]);

  const handleUpdate = async () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Please enter content title";
    if (!selectedTheme) newErrors.theme = "Please select theme";
    if (!selectedSubTheme) newErrors.subTheme = "Please select sub theme";
    if (!type) newErrors.type = "Please select content type";
    if (!status) newErrors.status = "Please select status";
    if (!contentUrl.trim()) newErrors.contentUrl = "Please enter content file URL";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    await updateDoc(doc(db, "contents", contentId), {
      title: title.trim(),
      type,
      status,
      themeId: selectedTheme,
      subThemeId: selectedSubTheme,
      contentUrl: contentUrl.trim(),
      showNote,
      note: showNote ? note.trim() : "",
    });

    navigate("/admin/manage-content");
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Content</h1>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Content Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          />
          <FormError message={errors.title} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Theme
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => {
              setSelectedTheme(e.target.value);
              setSelectedSubTheme("");
            }}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          >
            <option value="">Select Theme</option>
            {themes.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
          <FormError message={errors.theme} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Sub Theme
          </label>
          <select
            value={selectedSubTheme}
            onChange={(e) => setSelectedSubTheme(e.target.value)}
            disabled={!selectedTheme}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none disabled:bg-gray-100 focus:border-blue-500"
          >
            <option value="">Select Sub Theme</option>
            {subThemes.map((subTheme) => (
              <option key={subTheme.id} value={subTheme.id}>
                {subTheme.name}
              </option>
            ))}
          </select>
          <FormError message={errors.subTheme} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Content Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          >
            <option value="">Select</option>
            <option value="story">Story</option>
            <option value="song">Song</option>
            <option value="worksheet">Worksheet</option>
            <option value="game">Game</option>
          </select>
          <FormError message={errors.type} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
          </select>
          <FormError message={errors.status} />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <input
              type="checkbox"
              checked={showNote}
              onChange={(e) => setShowNote(e.target.checked)}
            />
            Show Note / Warning
          </label>

          {showNote && (
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Enter note or warning..."
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-400"
            />
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="mb-1 block text-sm font-medium text-gray-600">
          Content File URL
        </label>

        <input
          value={contentUrl}
          onChange={(e) => setContentUrl(e.target.value)}
          placeholder="/files/story1.mp4 or https://..."
          className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
        />
        <FormError message={errors.contentUrl} />
      </div>
      <div className="mt-8 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate("/admin/manage-content")}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button type="button" onClick={handleUpdate} className="btn-primary">
          Update Content
        </button>
      </div>
    </div>
  );
}

export default EditContent;
