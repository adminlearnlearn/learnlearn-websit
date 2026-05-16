import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import LogoutModal from "../components/common/LogoutModal";
function UserLayout() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <h1 className="text-2xl font-bold text-gray-900">LOGO</h1>

          <nav className="flex items-center gap-8 text-sm font-medium text-gray-700">
            <Link to="/home" className="hover:text-indigo-600">
              Home
            </Link>

            <Link to="/contact" className="hover:text-indigo-600">
              Contact Us
            </Link>
            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="rounded-lg px-3 py-2 text-red-500 hover:bg-red-50"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}

export default UserLayout;
