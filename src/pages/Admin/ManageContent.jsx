import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

function ManageContent() {
  const [contents, setContents] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchContents = async () => {
      const snapshot = await getDocs(collection(db, "contents"));

      const contentList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setContents(contentList);
    };

    fetchContents();
  }, []);

  const handleToggleStatus = async (contentId, currentStatus) => {
    const newStatus = currentStatus === "published" ? "hidden" : "published";

    await updateDoc(doc(db, "contents", contentId), {
      status: newStatus,
    });

    setContents((prev) =>
      prev.map((content) =>
        content.id === contentId ? { ...content, status: newStatus } : content,
      ),
    );
  };

  const filteredContents = contents.filter((content) => {
    const keyword = searchText.toLowerCase();

    const matchSearch =
      content.title?.toLowerCase().includes(keyword) ||
      content.type?.toLowerCase().includes(keyword);

    const matchStatus =
      statusFilter === "all" || content.status === statusFilter;

    return matchSearch && matchStatus;
  });

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Contents</h1>

        <div className="flex gap-3">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search content..."
            className="h-10 w-72 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
          />
          <select
            value={statusFilter || "all"}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredContents.map((content) => (
              <tr key={content.id} className="border-b hover:bg-blue-50">
                <td className="px-4 py-4 font-semibold">{content.title}</td>

                <td className="px-4 py-4 capitalize">{content.type}</td>

                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      content.status === "published"
                        ? "bg-green-100 text-green-700"
                        : content.status === "draft"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {content.status || "draft"}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-blue-300 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(content.id, content.status)
                      }
                      className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${
                        content.status === "published"
                          ? "bg-gray-500 hover:bg-gray-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {content.status === "published" ? "Hide" : "Publish"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredContents.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-10 text-center text-gray-400"
                >
                  No content found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageContent;
