import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

function EditContent() {
  const { contentId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("draft");
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("");
  const [selectedSubTheme, setSelectedSubTheme] = useState("");
  const [themes, setThemes] = useState([]);
  const [subThemes, setSubThemes] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      const contentSnap = await getDoc(doc(db, "contents", contentId));

      if (contentSnap.exists()) {
        const data = contentSnap.data();

        setTitle(data.title || "");
        setType(data.type || "");
        setStatus(data.status || "draft");
        setNote(data.note || "");
        setShowNote(data.showNote || false);
        setSelectedTheme(data.themeId || "");
        setSelectedSubTheme(data.subThemeId || "");
      }
    };

    fetchContent();
  }, [contentId]);

  const handleUpdate = async () => {
    await updateDoc(doc(db, "contents", contentId), {
      title,
      type,
      themeId: selectedTheme,
      subThemeId: selectedSubTheme,
      status,
      showNote,
      note: showNote ? note : "",
    });

    navigate("/admin/manage-content");
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Content</h1>

      <div className="grid gap-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Content Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
          />
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
        </div>

        <div>
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
              className="mt-2 w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-400"
            />
          )}
        </div>

        <div className="flex justify-end gap-3">
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
    </div>
  );
}

export default EditContent;
