import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const MAX_FAILED_LOGIN = 3;
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email.trim()),
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Email or password is incorrect.");
        return;
      }

      const userDoc = snapshot.docs[0];
      const user = {
        id: userDoc.id,
        ...userDoc.data(),
      };

      if (user.status !== "active") {
        setError("This account is locked. Please contact admin.");
        return;
      }

      if (user.isLocked || user.failedLoginCount >= 3) {
        await updateDoc(doc(db, "users", user.id), {
          isLocked: true,
          failedLoginCount: 3,
          status: "inactive",
        });

        setError("This account is locked. Please contact admin.");
        return;
      }

      if (user.mustChangePassword && password === user.tempPassword) {
        await updateDoc(doc(db, "users", user.id), {
          failedLoginCount: 0,
          isLocked: false,
        });

        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
          }),
        );
        navigate("/change-password", {
          state: {
            userId: user.id,
            role: user.role,
          },
        });
        return;
      }

      if (!user.mustChangePassword && password === user.password) {
        await updateDoc(doc(db, "users", user.id), {
          failedLoginCount: 0,
          isLocked: false,
          lastLoginAt: new Date(),
        });
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            id: user.id,
            email: user.email,
            role: user.role,
            username: user.username,
          }),
        );

        goToHomeByRole(user);
        return;
      }
      await increaseFailedLogin(user);

      setError("Email or password is incorrect.");
    } catch (err) {
      console.error(err);
      setError("Cannot login. Please try again.");
    }
  };
  const goToHomeByRole = (user) => {
    if (user.role === "Admin") {
      navigate("/admin/content", { replace: true });
    } else if (user.role === "Teacher") {
      navigate("/home", { replace: true });
    }
  };
  const lockAccount = async (userId) => {
    await updateDoc(doc(db, "users", userId), {
      isLocked: true,
      failedLoginCount: 3,
      status: "inactive",
    });
  };
  const increaseFailedLogin = async (user) => {
    const currentFailed = user.failedLoginCount || 0;
    const nextFailed = currentFailed + 1;

    if (nextFailed >= MAX_FAILED_LOGIN) {
      await lockAccount(user.id);
      setError("Your account has been locked. Please contact admin.");
      return;
    }

    await updateDoc(doc(db, "users", user.id), {
      failedLoginCount: nextFailed,
    });

    setError(`Email or password is incorrect. Attempt ${nextFailed}/3`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto grid min-h-[720px] max-w-7xl grid-cols-1 bg-white lg:grid-cols-2">
        <div className="flex items-center justify-center p-10">
          <img
            src="/login.png"
            alt="Login illustration"
            className="w-full max-w-xl"
          />
        </div>

        <div className="flex items-center justify-center p-10">
          <form onSubmit={handleLogin} className="w-full max-w-sm">
            <h1 className="mb-16 text-center text-7xl font-light tracking-wide text-black">
              LOGIN
            </h1>

            <div className="mb-4">
              <label className="mb-2 block text-sm text-gray-700">Email</label>
              <input
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-gray-500"
              />
            </div>

            <div className="mb-5">
              <label className="mb-2 block text-sm text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-gray-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <label className="mb-8 flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 accent-gray-800"
              />
              Remember me
            </label>

            {error && (
              <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="h-12 w-full rounded-full bg-[#2f2f2f] text-sm font-medium text-white transition hover:bg-black"
            >
              Login
            </button>

            <button
              type="button"
              className="mt-6 block w-full text-center text-sm text-gray-400 hover:text-gray-700"
            >
              Contact Us ?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
