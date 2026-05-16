import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ allowedRoles }) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;