import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Eye, EyeOff } from "lucide-react";

function ChangePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const userId = location.state?.userId;
  const role = location.state?.role;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e, setter) => {
    const value = e.target.value;

    const englishOnly = value.replace(/[^A-Za-z0-9@#$!]/g, "");

    setter(englishOnly);
  };
  const handleChangePassword = async (e) => {
    e.preventDefault();

    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await updateDoc(doc(db, "users", userId), {
        password: newPassword,
        tempPassword: null,
        mustChangePassword: false,
      });

      navigate(role === "Admin" ? "/admin/content" : "/home");
    } catch (err) {
      console.error(err);
      setError("Cannot change password.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Change Password
        </h1>

        <p className="mb-8 text-sm text-gray-500">
          Please create a new password for your account.
        </p>

        <form onSubmit={handleChangePassword}>
          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => handlePasswordChange(e, setNewPassword)}
                placeholder="Enter new password"
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handlePasswordChange(e, setConfirmPassword)}
                placeholder="Confirm password"
                className="h-12 w-full rounded-xl border border-gray-300 px-4 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
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

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="h-12 w-full rounded-xl bg-indigo-600 font-medium text-white transition hover:bg-indigo-700"
          >
            Save New Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
