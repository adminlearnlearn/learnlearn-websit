import { NavLink } from "react-router-dom";

function Sidebar({ onClose }) {
  return (
    <aside className="w-64 bg-white min-h-screen p-5 flex flex-col border-r border-slate-200">
      {/* Logo */}
      <div className="mb-8 flex items-center  justify-between">
        <div className="text-3xl-xl font-bold text-blue-600 mb-10">
          LOGO Admin
        </div>

        <button className="md:hidden" onClick={onClose}>
          ✕
        </button>
      </div>

      {/* Menu */}
      <nav className="space-y-2 text-sm flex-1">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-2 ${
              isActive
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-2 ${
              isActive
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
            }`
          }
        >
          User Management
        </NavLink>

        <NavLink
          to="/admin/content"
          className={({ isActive }) =>
            `block rounded-xl px-4 py-2 ${
              isActive
                ? "bg-blue-50 font-semibold text-blue-600"
                : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
            }`
          }
        >
          Content Management
        </NavLink>
        {/* Logout */}
        <button className="rounded-2xl px-4 py-3 text-left text-red-500 hover:bg-red-50 hover:translate-x-1">
          Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;
