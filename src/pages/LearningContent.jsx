import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

function LearningContent() {
  const navigate = useNavigate();
  const { themeId, subThemeId, contentId } = useParams();

  const [content, setContent] = useState(null);
  const [isCompleted, setIsCompleted] = useState(null);

  // โหลด Content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const contentSnap = await getDoc(doc(db, "contents", contentId));

        if (contentSnap.exists()) {
          setContent({
            id: contentSnap.id,
            ...contentSnap.data(),
          });
        }
      } catch (error) {
        console.error("Load content failed:", error);
      }
    };

    fetchContent();
  }, [contentId]);

  // ================================
  // TRACK USER CURRENT CONTENT TYPE
  // ================================
  useEffect(() => {
    if (!content) return;

    const rawUser = localStorage.getItem("currentUser");

    if (!rawUser) return;

    let currentUser;

    try {
      currentUser = JSON.parse(rawUser);
    } catch {
      return;
    }

    if (!currentUser?.id) return;

    const role = String(currentUser.role ?? "")
      .trim()
      .toLowerCase();

    // Track เฉพาะ Teacher
    if (role !== "teacher") return;

    const userRef = doc(db, "users", currentUser.id);

    const updateCurrentActivity = async () => {
      try {
        await updateDoc(userRef, {
          isOnline: true,
          currentPage: "content",
          currentContentType: content.type ?? null,
          lastSeenAt: serverTimestamp(),
        });
      } catch (error) {
        console.error("Update current activity failed:", error);
      }
    };

    updateCurrentActivity();

    // ตอนออกจากหน้า Content
    return () => {
      updateDoc(userRef, {
        currentContentType: null,
      }).catch((error) => {
        console.error("Clear current activity failed:", error);
      });
    };
  }, [content]);

  // ======================================
  // TRACK CONTENT PROGRESS
  // ======================================
  useEffect(() => {
    if (!content) return;

    const trackContentView = async () => {
      try {
        // ✅ ทุกครั้งที่เปลี่ยน Content
        // ให้กลับเข้าสถานะ loading ก่อน
        setIsCompleted(null);

        const rawUser = localStorage.getItem("currentUser");

        if (!rawUser) return;

        const currentUser = JSON.parse(rawUser);

        if (!currentUser?.id) return;

        const role = String(currentUser.role ?? "")
          .trim()
          .toLowerCase();

        // เก็บ progress เฉพาะ Teacher
        if (role !== "teacher") return;

        const progressId = `${currentUser.id}_${contentId}`;

        const progressRef = doc(db, "contentProgress", progressId);

        // กำลังตรวจสอบสถานะจาก Firestore
        setIsCompleted(null);

        const progressSnap = await getDoc(progressRef);

        // ถ้าเคยเปิด Content นี้แล้ว
        if (progressSnap.exists()) {
          const progressData = progressSnap.data();

          // แสดงสถานะทันทีหลังอ่าน Firestore ได้
          setIsCompleted(progressData.completed === true);

          // อัปเดตเวลาเข้าดูล่าสุด
          await setDoc(
            progressRef,
            {
              viewed: true,
              lastViewedAt: serverTimestamp(),
            },
            { merge: true },
          );

          return;
        }

        // ถ้าเป็นการเปิดครั้งแรก
        await setDoc(progressRef, {
          userId: currentUser.id,
          userName: currentUser.name || currentUser.username || "",

          contentId,
          contentTitle: content.title || "",
          contentType: content.type || "",

          themeId,
          subThemeId,

          viewed: true,

          firstViewedAt: serverTimestamp(),
          lastViewedAt: serverTimestamp(),

          completed: false,
          completedAt: null,
        });

        // ค่อยเปลี่ยนเป็น false หลังสร้างข้อมูลสำเร็จ
        setIsCompleted(false);
      } catch (error) {
        console.error("Track content progress failed:", error);
      }
    };

    trackContentView();
  }, [content, contentId, themeId, subThemeId]);

  const handleComplete = async () => {
    try {
      // ถ้า Completed ไปแล้ว ไม่ต้องบันทึกซ้ำ
      if (isCompleted === true) return;

      const rawUser = localStorage.getItem("currentUser");

      if (!rawUser) return;

      const currentUser = JSON.parse(rawUser);

      if (!currentUser?.id) return;

      const progressId = `${currentUser.id}_${contentId}`;

      const progressRef = doc(db, "contentProgress", progressId);

      await setDoc(
        progressRef,
        {
          completed: true,
          completedAt: serverTimestamp(),
          lastViewedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setIsCompleted(true);
    } catch (error) {
      console.error("Complete content failed:", error);
    }
  };
  if (!content) {
    return (
      <main className="rounded-[2.5rem] bg-white p-10">
        <p className="text-gray-400">Loading content...</p>
      </main>
    );
  }

  const gameUrl = content.contentUrl?.trim() || "";

  return (
    <main className="min-h-[calc(100vh-120px)] rounded-[2.5rem] bg-white p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(`/themes/${themeId}/subthemes/${subThemeId}`)
            }
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
            <p className="text-sm font-semibold text-red-600">{content.note}</p>
          </div>
        )}

        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6">
          {(content.type === "story" || content.type === "song") && (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black">
              <iframe
                src={content.contentUrl}
                title={content.title || "Video"}
                className="aspect-video w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          )}

          {content.type === "worksheet" && (
            <iframe
              src={content.contentUrl}
              title={content.title}
              className="h-[75vh] w-full rounded-2xl bg-white"
            />
          )}

          {content.type === "game" && (
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              {gameUrl ? (
                <iframe
                  src={gameUrl}
                  title={content.title || "Game"}
                  className="h-[70vh] min-h-[500px] w-full"
                  allow="fullscreen; autoplay; clipboard-write"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="flex h-[350px] items-center justify-center text-gray-400">
                  Game URL not found
                </div>
              )}
            </div>
          )}
          {/* COMPLETE BUTTON */}
          {(content.type === "worksheet" || content.type === "game") && (
            <div className="mt-6 flex justify-end">
              {isCompleted === null ? (
                <div className="h-12 w-48 animate-pulse rounded-xl bg-gray-100" />
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={isCompleted}
                  className={`rounded-xl px-6 py-3 font-semibold transition ${
                    isCompleted
                      ? "cursor-default bg-green-100 text-green-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isCompleted ? "✓ Completed" : "Mark as Completed"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default LearningContent;
