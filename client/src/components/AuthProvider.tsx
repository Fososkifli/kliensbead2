import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../store/authApi';
import { setUser } from '../store/authSlice';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const { data: user, isLoading, isSuccess, isError } = useGetMeQuery();

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setUser(user));
    } else if (isError) {
      dispatch(setUser(null));
    }
  }, [user, isSuccess, isError, dispatch]);

  return <>{children}</>;
}
