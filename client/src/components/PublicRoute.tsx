import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../store/authSlice';

export default function PublicRoute() {
  const user = useSelector(selectUser);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
