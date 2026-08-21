import { useState } from "react";
// import UploadBox from "./UploadBox";
import ThemeModal from "./ThemeModal";
import SubThemeModal from "./SubThemeModal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Pencil } from "lucide-react";
import FormError from "../../common/FormError";

const isValidUrl = (value) => {
  try {
    const url = new URL(value.trim());

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

function ContentForm({
  contentTitle,
  setContentTitle,
  contentType,
  setContentType,
  themes = [],
  subThemes = [],
  setThemes,
  setSubThemes,
  selectedTheme,
  selectedSubTheme,
  handleThemeChange,
  setSelectedSubTheme,
  handleSave,
  handleAddTheme,
  handleAddSubTheme,
}) {
  // const [contentFile, setContentFile] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSubThemeModalOpen, setIsSubThemeModalOpen] = useState(false);
  const [isEditThemeOpen, setIsEditThemeOpen] = useState(false);
  const [isEditSubThemeOpen, setIsEditSubThemeOpen] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [newSubThemeName, setNewSubThemeName] = useState("");
  const [editThemeName, setEditThemeName] = useState("");
  const [editSubThemeName, setEditSubThemeName] = useState("");
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const currentTheme = themes.find((t) => t.id === selectedTheme);
  const currentSubTheme = subThemes.find((t) => t.id === selectedSubTheme);
  const [contentUrl, setContentUrl] = useState("");
  const canPreview = isValidUrl(contentUrl);

  const handleUpdateTheme = async () => {
    if (!selectedTheme || !editThemeName.trim()) return;

    await updateDoc(doc(db, "themes", selectedTheme), {
      name: editThemeName,
    });

    setThemes((prev) =>
      prev.map((theme) =>
        theme.id === selectedTheme ? { ...theme, name: editThemeName } : theme,
      ),
    );

    setIsEditThemeOpen(false);
  };
  const handleUpdateSubTheme = async () => {
    if (!selectedSubTheme || !editSubThemeName.trim()) return;

    await updateDoc(doc(db, "subThemes", selectedSubTheme), {
      name: editSubThemeName,
    });

    setSubThemes((prev) =>
      prev.map((sub) =>
        sub.id === selectedSubTheme ? { ...sub, name: editSubThemeName } : sub,
      ),
    );

    setIsEditSubThemeOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
        <p className="text-lg font-semibold text-gray-800 mb-6">
          Create New Content
        </p>
        {/* Create New Content */}
        <div className="grid grid-cols-2  gap-5">
          {/* Content Title */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Content Title
            </label>

            <input
              className="h-11 w-full rounded-xl border border-gray-300 px-4 focus:border-blue-500 outline-none"
              placeholder="Enter content title"
              value={contentTitle}
              onChange={(e) => {
                setContentTitle(e.target.value);

                if (errors.title) {
                  setErrors((prev) => ({
                    ...prev,
                    title: "",
                  }));
                }
              }}
            />
            <FormError message={errors.title} />
          </div>
          {/* Theme */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Theme
            </label>
            <div className="flex gap-2">
              <div className="relative w-full">
                <select
                  className="h-11 w-full rounded-xl border border-gray-300 px-4 pr-10"
                  data-testid="theme-select"
                  value={selectedTheme}
                  onChange={handleThemeChange}
                >
                  <option value="">Select Theme</option>
                  {themes?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {selectedTheme && (
                  <Pencil
                    size={16}
                    data-testid="edit-theme-btn"
                    className="absolute right-5 top-1/2 -translate-y-1/2  cursor-pointer   text-gray-400  hover:text-black"
                    onClick={() => {
                      if (!currentTheme) return;
                      setEditThemeName(currentTheme.name);
                      setIsEditThemeOpen(true);
                    }}
                  />
                )}
              </div>
              <button
                type="button"
                className="btn-add h-11 px-4 border-gray-200 text-gray-600"
                data-testid="create-theme-btn"
                onClick={() => {
                  setIsThemeModalOpen(true);
                }}
              >
                <span className="btn-add__text">New</span>
                <span className="btn-add__icon">
                  <svg
                    className="btn-add__svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </div>
            <FormError message={errors.theme} />
          </div>
          {/*   Sub Theme */}
          <div className="md:col-span-1 ">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sub Theme
            </label>
            <div className="flex flex-1 gap-5">
              <div className="relative w-full">
                <select
                  className="h-11 w-full px-4  rounded-xl border border-gray-300  pr-10 disabled:bg-gray-100"
                  data-testid="subtheme-select"
                  value={selectedSubTheme}
                  onChange={(e) => setSelectedSubTheme(e.target.value)}
                  disabled={!selectedTheme}
                >
                  <option value="">Select SubTheme</option>
                  {subThemes?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {selectedSubTheme && (
                  <Pencil
                    size={16}
                    data-testid="edit-subtheme-btn"
                    className="absolute right-5 top-1/2 -translate-y-1/2  cursor-pointer   text-gray-400  hover:text-black"
                    onClick={() => {
                      if (!currentSubTheme) return;
                      setEditSubThemeName(currentSubTheme.name);
                      setIsEditSubThemeOpen(true);
                    }}
                  />
                )}
              </div>
              <button
                type="button"
                className="btn-add h-11 border-gray-200 text-gray-600"
                data-testid="create-subtheme-btn"
                onClick={() => {
                  setIsSubThemeModalOpen(true);
                }}
                disabled={!selectedTheme}
              >
                <span className="btn-add__text">New</span>
                <span className="btn-add__icon">
                  <svg
                    className="btn-add__svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth="2"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
            </div>
            <FormError message={errors.subTheme} />
          </div>

          {/* // Content Type */}
          <div className="md:col-span-1 ">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Content Type
            </label>
            <div className="flex flex-1 gap-5">
              <div className="relative w-full">
                <select
                  className="h-11 w-full rounded-xl border border-gray-300 px-3 pr-14"
                  value={contentType}
                  onChange={(e) => {
                    const nextType = e.target.value;

                    setContentType(nextType);
                    setShowPreview(false);

                    setErrors((prev) => ({
                      ...prev,
                      type: "",
                      file: "",
                      embedUrl: "",
                    }));
                  }}
                >
                  <option value="">Select</option>
                  <option value="story">Story</option>
                  <option value="song">Song</option>
                  <option value="worksheet">Worksheet</option>
                  <option value="game">Game</option>
                </select>
              </div>
            </div>
            <FormError message={errors.type} />
          </div>

          <div className="space-y-2">
            <input
              type="checkbox"
              checked={showNote}
              onChange={(e) => setShowNote(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label className="text-sm font-semibold text-gray-700">
              Note / Warning
            </label>
            {showNote && (
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter note or warning..."
                rows={3}
                className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-red-400"
              />
            )}
          </div>
        </div>

        {/* Content Source */}
        <div className="mt-10 mb-6">
          <div className="mx-auto w-full max-w-3xl">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Content URL
            </label>

            <input
              type="url"
              value={contentUrl}
              onChange={(e) => {
                setContentUrl(e.target.value);

                if (errors.contentUrl) {
                  setErrors((prev) => ({
                    ...prev,
                    contentUrl: "",
                  }));
                }
              }}
              placeholder="https://example.com/embed/..."
              className="h-11 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-blue-500"
            />

            <p className="mt-2 text-xs text-gray-400">
              Enter a URL that supports embedding in an iframe.
            </p>

            <FormError message={errors.contentUrl} />
          </div>
        </div>

        {/* buutton */}
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <button
            type="button"
            onClick={async () => {
              const newErrors = {};
              const cleanContentUrl = contentUrl.trim();

              if (!contentTitle.trim()) {
                newErrors.title = "Please enter content title";
              }

              if (!selectedTheme) {
                newErrors.theme = "Please select theme";
              }

              if (!selectedSubTheme) {
                newErrors.subTheme = "Please select sub theme";
              }

              if (!contentType) {
                newErrors.type = "Please select content type";
              }

              if (!cleanContentUrl) {
                newErrors.contentUrl = "Please enter content URL";
              } else if (!isValidUrl(cleanContentUrl)) {
                newErrors.contentUrl =
                  "Please enter a valid URL starting with https://";
              }

              setErrors(newErrors);

              if (Object.keys(newErrors).length > 0) return;

              try {
                await handleSave({
                  contentUrl: contentUrl.trim(),
                  showNote,
                  note: showNote ? note.trim() : "",
                });
              } catch (error) {
                console.error("Save content failed:", error);

                setErrors((prev) => ({
                  ...prev,
                  submit: "Unable to save content. Please try again.",
                }));
              }
            }}
            className="btn-primary"
            data-testid="save-draft-btn"
          >
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            data-testid="preview-content-btn"
            disabled={!canPreview}
            onClick={() => setShowPreview(true)}
            className={`px-6 py-3 rounded-xl border btn-secondary
            ${
              canPreview
                ? "bg-white hover:bg-gray-50"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Preview
          </button>

          <button className="btn-danger" data-testid="cancel-content-btn">
            Cancel
          </button>
        </div>
      </div>
      {/* Preview Modal */}
      {showPreview && canPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-[95vw] max-w-5xl rounded-2xl bg-white p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Preview Content</h2>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Close
              </button>
            </div>

            <iframe
              src={contentUrl.trim()}
              title={contentTitle || "Content preview"}
              className="h-[75vh] min-h-[500px] w-full rounded-xl border"
              allow="fullscreen; autoplay; clipboard-write"
              allowFullScreen
            />
          </div>
        </div>
      )}
      {isThemeModalOpen && (
        <ThemeModal
          title="Add Theme"
          label="Theme Name"
          value={newThemeName}
          setValue={setNewThemeName}
          onClose={() => setIsThemeModalOpen(false)}
          onSave={() => {
            if (!newThemeName.trim()) return;
            handleAddTheme(newThemeName.trim());
            setNewThemeName("");
            setIsThemeModalOpen(false);
          }}
        />
      )}
      {isEditThemeOpen && (
        <ThemeModal
          title="Edit Theme"
          label="Theme Name"
          value={editThemeName}
          setValue={setEditThemeName}
          onClose={() => setIsEditThemeOpen(false)}
          onSave={handleUpdateTheme}
        />
      )}

      {isSubThemeModalOpen && (
        <SubThemeModal
          title="Add Sub Theme"
          label="Sub Theme Name"
          value={newSubThemeName}
          setValue={setNewSubThemeName}
          onClose={() => setIsSubThemeModalOpen(false)}
          onSave={() => {
            if (!newSubThemeName.trim()) return;
            handleAddSubTheme(newSubThemeName.trim());
            setNewSubThemeName("");
            setIsSubThemeModalOpen(false);
          }}
        />
      )}

      {isEditSubThemeOpen && (
        <SubThemeModal
          title="Edit SubTheme"
          label="SubTheme Name"
          value={editSubThemeName}
          setValue={setEditSubThemeName}
          onClose={() => setIsEditSubThemeOpen(false)}
          onSave={handleUpdateSubTheme}
        />
      )}
    </>
  );
}

export default ContentForm;
