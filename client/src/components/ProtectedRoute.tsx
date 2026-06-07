import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../store/authSlice';

interface ProtectedRouteProps {
  roles?: ('user' | 'admin')[];
}

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const user = useSelector(selectUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
