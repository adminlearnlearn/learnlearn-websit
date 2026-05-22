import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import ContentManagement from "../pages/Admin/ContentManagement";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import UserManagement from "../pages/Admin/UserManagement";
import LoginPage from "../pages/LoginPage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ContactUs from "../pages/ContactUs";
import ThemePage from "../pages/Themes";
import SubThemePage from "../pages/SubThemePage";
import ProtectedRoute from "./ProtectedRoute";
import LearningContent from "../pages/LearningContent";
import ManageContent from "../pages/Admin/ManageContent";
import EditContent from "../pages/Admin/EditContent";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />

      <Route element={<ProtectedRoute allowedRoles={["Teacher"]} />}>
        <Route element={<UserLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/themes/:themeId" element={<ThemePage />} />
          <Route
            path="/themes/:themeId/subthemes/:subThemeId"
            element={<SubThemePage />}
          />
          <Route
            path="/themes/:themeId/subthemes/:subThemeId/contents/:contentId"
            element={<LearningContent />}
          />
          <Route path="/contact" element={<ContactUs />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
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
        <Route
          path="/admin/manage-content"
          element={
            <AdminLayout>
              <ManageContent />
            </AdminLayout>
          }
        ></Route>
        <Route
          path="/admin/manage-content/edit/:contentId"
          element={
            <AdminLayout>
              <EditContent />
            </AdminLayout>
          }
        ></Route>
      </Route>
    </Routes>
  );
}

export default AppRoutes;
