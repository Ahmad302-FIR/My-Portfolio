import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { authService } from '../../../services/authService';

export default function ProtectedAdminRoute() {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
