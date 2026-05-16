import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/admin/navigation/Sidebar";
import Topbar from "../components/admin/navigation/Topbar";
import LogoutModal from "../components/common/LogoutModal";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    sessionStorage.clear();

    setShowLogoutModal(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 md:flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-white transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          onClose={() => setIsSidebarOpen(false)}
          onLogout={() => setShowLogoutModal(true)}
        />
      </aside>

      <div className="min-w-0 flex-1">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 bg-slate-100 min-h-screen px-6 py-6">
          <div className="max-w-10xl mx-auto">{children}</div>
        </main>
      </div>
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}

export default AdminLayout;
