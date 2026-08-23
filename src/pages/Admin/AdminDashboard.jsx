import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { ChevronDown, ChevronUp, Circle } from "lucide-react";
import { db } from "../../firebase";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [contents, setContents] = useState([]);
  const [contentProgress, setContentProgress] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [now, setNow] = useState(Date.now());

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

    const timer = setInterval(() => {
      setNow(Date.now());
    }, 30000);
    // ✅ Content Progress
    const unsubscribeProgress = onSnapshot(
      collection(db, "contentProgress"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setContentProgress(data);
      },
    );

    return () => {
      unsubscribeUsers();
      unsubscribeContents();
      unsubscribeProgress();
      clearInterval(timer);
    };
  }, []);

  // ชั่วคราว:
  // จะถือว่า user ที่มี isOnline === true คือ Online
  // เดี๋ยวเราค่อยทำระบบ Online จริงในขั้นต่อไป
  // const onlineUsers = useMemo(() => {
  //   const ONLINE_TIMEOUT = 2 * 60 * 1000;

  //   return users.filter((user) => {
  //     const role = String(user.role ?? "")
  //       .trim()
  //       .toLowerCase();

  //     if (role !== "teacher") return false;

  //     if (user.isOnline === false) return false;

  //     if (!user.lastSeenAt) return false;

  //     let lastSeenDate;

  //     if (typeof user.lastSeenAt?.toDate === "function") {
  //       lastSeenDate = user.lastSeenAt.toDate();
  //     } else if (user.lastSeenAt?.seconds) {
  //       lastSeenDate = new Date(user.lastSeenAt.seconds * 1000);
  //     } else {
  //       lastSeenDate = new Date(user.lastSeenAt);
  //     }

  //     if (Number.isNaN(lastSeenDate.getTime())) {
  //       return false;
  //     }

  //     const timeDifference = now - lastSeenDate.getTime();

  //     return timeDifference <= ONLINE_TIMEOUT;
  //   });
  // }, [users, now]);
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
  const formatLastSeen = (value) => {
    if (!value) return "-";

    let date;

    if (typeof value?.toDate === "function") {
      date = value.toDate();
    } else if (value?.seconds) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const formatCurrentActivity = (user) => {
    const type = String(user.currentContentType ?? "")
      .trim()
      .toLowerCase();

    // ถ้ากำลังเปิด Content ให้เอาประเภท Content ขึ้นก่อน
    if (user.currentPage === "content" && type) {
      const contentTypes = {
        story: "Story",
        song: "Song",
        worksheet: "Worksheet",
        game: "Game",
      };

      return contentTypes[type] || type;
    }

    const path = String(user.currentPath ?? "");

    if (path === "/home") {
      return "Home";
    }

    if (path.includes("/contents/")) {
      return "Content";
    }

    if (path.includes("/subthemes/")) {
      return "Sub Theme";
    }

    if (path.includes("/themes")) {
      return "Theme";
    }

    return "-";
  };

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
  const teacherProgress = useMemo(() => {
    const teachers = users.filter(
      (user) =>
        String(user.role ?? "")
          .trim()
          .toLowerCase() === "teacher",
    );

    const totalContent = contents.length;

    return teachers.map((teacher) => {
      const teacherRecords = contentProgress.filter(
        (progress) => progress.userId === teacher.id,
      );

      const viewedCount = teacherRecords.filter(
        (progress) => progress.viewed === true,
      ).length;

      const completedCount = teacherRecords.filter(
        (progress) => progress.completed === true,
      ).length;

      const percentage =
        totalContent > 0
          ? Math.round((completedCount / totalContent) * 100)
          : 0;

      return {
        id: teacher.id,
        name: teacher.name || teacher.username || "Unnamed Teacher",
        school: teacher.school || "-",

        viewedCount,
        completedCount,
        totalContent,
        percentage,
      };
    });
  }, [users, contents, contentProgress]);

  const selectedTeacherData = teacherProgress.find(
    (teacher) => teacher.id === selectedTeacher,
  );

  const activeUsers = useMemo(() => {
    return users.filter(
      (user) =>
        String(user.status ?? "")
          .trim()
          .toLowerCase() === "active",
    );
  }, [users]);

  const displayedUsers = showAllUsers ? activeUsers : onlineUsers;

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

            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${
                showOnlineUsers
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                {onlineUsers.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-gray-400">No users online</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className="bg-gray-50 text-gray-500">
                        <tr>
                          <th className="px-4 py-3 font-medium">Teacher</th>

                          <th className="px-4 py-3 font-medium">School</th>

                          <th className="px-4 py-3 font-medium">Activity</th>

                          <th className="px-4 py-3 font-medium">Last Seen</th>

                          <th className="px-4 py-3 text-center font-medium">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {displayedUsers.map((user) => {
                          const isUserOnline = onlineUsers.some(
                            (onlineUser) => onlineUser.id === user.id,
                          );

                          return (
                            <tr
                              key={user.id}
                              onClick={() => setSelectedTeacher(user.id)}
                              className={`cursor-pointer transition ${
                                selectedTeacher === user.id
                                  ? "bg-indigo-50"
                                  : "hover:bg-gray-50"
                              }`}
                            >
                              {/* Teacher */}
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`h-2.5 w-2.5 flex-none rounded-full ${
                                      isUserOnline
                                        ? "bg-green-500"
                                        : "bg-gray-300"
                                    }`}
                                  />

                                  <div>
                                    <p className="font-semibold text-gray-800">
                                      {user.name ||
                                        user.username ||
                                        "Unnamed User"}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                      {user.email || ""}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* School */}
                              <td className="px-4 py-4 text-gray-600">
                                {user.school || "-"}
                              </td>

                              {/* Activity */}
                              <td className="px-4 py-4 text-gray-600">
                                {formatCurrentActivity(user) === "-"
                                  ? "-"
                                  : `On ${formatCurrentActivity(user)}`}
                              </td>

                              {/* Last Seen */}
                              <td className="px-4 py-4 text-gray-500">
                                {formatLastSeen(user.lastSeenAt)}
                              </td>

                              {/* Status */}
                              <td className="px-4 py-4 text-center">
                                {isUserOnline ? (
                                  <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                    <span className="h-2 w-2 rounded-full bg-green-500" />
                                    Online
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                                    Offline
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllUsers((prev) => !prev)}
                  className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 hover:underline"
                >
                  {showAllUsers ? "Show Online Only" : "View All Users"}
                </button>
              </div>
            </div>

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
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Teaching Progress
            </h2>

            {selectedTeacher !== "all" && (
              <button
                type="button"
                onClick={() => setSelectedTeacher("all")}
                className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-200"
              >
                View All
              </button>
            )}
          </div>

          {selectedTeacherData && (
            <p className="mt-1 text-sm text-gray-400">
              {selectedTeacherData.name}
            </p>
          )}
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
