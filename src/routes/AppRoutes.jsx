import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import ContentManagement from "../pages/Admin/ContentManagement";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import LoginPage from "../pages/LoginPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/content" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />


      <Route element={<UserLayout />}>
        <Route path="/home" element={<Home />} />
      </Route>

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <UserManagement />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/content"
        element={
          <AdminLayout>
            <ContentManagement />
          </AdminLayout>
        }
      ></Route>
    </Routes>
  );
}

export default AppRoutes;
