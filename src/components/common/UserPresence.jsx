import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

function UserPresence() {
  const location = useLocation();

  useEffect(() => {
    const rawUser = localStorage.getItem("currentUser");

    if (!rawUser) return;

    let currentUser;

    try {
      currentUser = JSON.parse(rawUser);
    } catch {
      return;
    }

    if (!currentUser?.id) return;

    // ตอนนี้ให้ track เฉพาะ Teacher
    const role = String(currentUser.role ?? "")
      .trim()
      .toLowerCase();

    if (role !== "teacher") return;

    const userRef = doc(
      db,
      "users",
      currentUser.id,
    );

    const updatePresence = async () => {
      try {
        await updateDoc(userRef, {
          isOnline: true,
          lastSeenAt: serverTimestamp(),
          currentPath: location.pathname,
        });
      } catch (error) {
        console.error(
          "Update user presence failed:",
          error,
        );
      }
    };

    // update ทันทีเมื่อเข้า page
    updatePresence();

    // update ทุก 60 วินาที
    const heartbeat = setInterval(() => {
      updatePresence();
    }, 60000);

    // กลับมาเปิด tab ก็ update ทันที
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        updatePresence();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      clearInterval(heartbeat);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [location.pathname]);

  return null;
}

export default UserPresence;