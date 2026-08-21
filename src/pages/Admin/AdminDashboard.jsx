import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { ChevronDown, ChevronUp, Circle } from "lucide-react";
import { db } from "../../firebase";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [contents, setContents] = useState([]);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);

  useEffect(() => {
    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const userList = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setUsers(userList);
      },
      (error) => {
        console.error("Load users failed:", error);
      },
    );

    const unsubscribeContents = onSnapshot(
      collection(db, "contents"),
      (snapshot) => {
        const contentList = snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setContents(contentList);
      },
      (error) => {
        console.error("Load contents failed:", error);
      },
    );

    return () => {
      unsubscribeUsers();
      unsubscribeContents();
    };
  }, []);

  // ชั่วคราว:
  // จะถือว่า user ที่มี isOnline === true คือ Online
  // เดี๋ยวเราค่อยทำระบบ Online จริงในขั้นต่อไป
  const onlineUsers = useMemo(() => {
    return users.filter((user) => user.isOnline === true);
  }, [users]);

  const totalTeachers = useMemo(() => {
    return users.filter(
      (user) =>
        String(user.role ?? "")
          .trim()
          .toLowerCase() === "teacher",
    ).length;
  }, [users]);

  const activeToday = useMemo(() => {
    const today = new Date();

    return users.filter((user) => {
      if (!user.lastLoginAt) return false;

      let loginDate;

      // Firestore Timestamp
      if (typeof user.lastLoginAt?.toDate === "function") {
        loginDate = user.lastLoginAt.toDate();
      } else if (user.lastLoginAt?.seconds) {
        loginDate = new Date(user.lastLoginAt.seconds * 1000);
      } else {
        loginDate = new Date(user.lastLoginAt);
      }

      if (Number.isNaN(loginDate.getTime())) return false;

      return (
        loginDate.getDate() === today.getDate() &&
        loginDate.getMonth() === today.getMonth() &&
        loginDate.getFullYear() === today.getFullYear()
      );
    }).length;
  }, [users]);

  const contentSummary = useMemo(() => {
    const summary = {
      total: contents.length,
      story: 0,
      song: 0,
      worksheet: 0,
      game: 0,
    };

    contents.forEach((content) => {
      const type = String(content.type ?? "")
        .trim()
        .toLowerCase();

      if (type === "story") summary.story += 1;
      if (type === "song") summary.song += 1;
      if (type === "worksheet") summary.worksheet += 1;
      if (type === "game") summary.game += 1;
    });

    return summary;
  }, [contents]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Overview */}
      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">Overview</h2>

        {/* Content แบบย่อด้านบน ตอนเปิด Online Users */}
        {showOnlineUsers && (
          <div className="mb-6 flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
            <div>
              <p className="text-xs font-semibold uppercase text-gray-400">
                CONTENT
              </p>

              <p className="mt-1 text-sm text-gray-500">Total Contents</p>
            </div>

            <p className="text-3xl font-bold text-gray-900">
              {contentSummary.total}
            </p>
          </div>
        )}

        {/* Users + Content */}
        <div
          className={`grid grid-cols-1 gap-6 transition-all duration-500 ease-in-out ${
            showOnlineUsers ? "lg:grid-cols-1" : "lg:grid-cols-2"
          }`}
        >
          {/* ================= USERS CARD ================= */}
          <div className="p-6">
            <h3 className="mb-5 text-2xl font-bold text-gray-900">Users</h3>

            {/* Online Now */}
            <button
              type="button"
              onClick={() => setShowOnlineUsers((current) => !current)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-4 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-green-500" />

                <span className="font-semibold text-gray-800">Online Now</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xl font-bold text-gray-900">
                  {onlineUsers.length}
                </span>

                {showOnlineUsers ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </div>
            </button>

            {/* User Summary */}
            {!showOnlineUsers && (
              <div className="mt-5 grid grid-cols-2 gap-4">
                {/* Active Today */}
                <div className="rounded-xl bg-gray-50 px-4 py-4">
                  <p className="text-sm text-gray-500">Active Today</p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {activeToday}
                  </p>
                </div>

                {/* Total Teachers */}
                <div className="rounded-xl bg-gray-50 px-4 py-4">
                  <p className="text-sm text-gray-500">Total Teachers</p>

                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {totalTeachers}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ================= CONTENT CARD ================= */}
          {!showOnlineUsers && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-2xl font-bold text-gray-900">CONTENT</h3>

              <div className="mb-6">
                <p className="text-4xl font-bold text-gray-900">
                  {contentSummary.total}
                </p>

                <p className="text-sm text-gray-400">Total Contents</p>
              </div>

              <div className="space-y-4">
                <ContentRow label="Story" value={contentSummary.story} />

                <ContentRow label="Song" value={contentSummary.song} />

                <ContentRow
                  label="Worksheet"
                  value={contentSummary.worksheet}
                />

                <ContentRow label="Game" value={contentSummary.game} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Teaching Progress */}
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Teaching Progress
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Teacher content completion progress
            </p>
          </div>

          <select className="rounded-xl border border-gray-200 px-4 py-2 text-sm outline-none">
            <option>All Teachers</option>
          </select>
        </div>

        {/* ยังไม่มี Tracking จริง */}
        <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-gray-200">
          <div className="text-center">
            <p className="font-medium text-gray-500">Teaching Progress</p>

            <p className="mt-2 text-sm text-gray-400">
              Progress data will appear after content tracking is added.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContentRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-gray-600">{label}</span>

      <span className="font-bold text-gray-900">{value}</span>
    </div>
  );
}

export default AdminDashboard;
