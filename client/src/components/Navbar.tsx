import { Link, useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useSelector, useDispatch } from "react-redux";
import { selectUser } from "../store/authSlice";
import { useLogoutMutation } from "../store/authApi";
import { logout as clearUser } from "../store/authSlice";
import { toast } from 'react-toastify';

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      toast.success('Sikeres kijelentkezés!');
    } catch (e) {
      console.error(e);
      toast.error('Kijelentkezés sikertelen');
    }
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background ml-4 mr-4">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        
        <div className="flex items-center gap-6">
          <Link to="/" className="font-semibold text-foreground text-lg">Roomlie</Link>

          <Separator orientation="vertical" className="h-6" />

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-foreground hover:underline">Terem</Link>
            
            {!user && (
              <>
                <Link to="/login" className="text-foreground hover:underline">Bejelentkezés</Link>
                <Link to="/register" className="text-foreground hover:underline">Regisztráció</Link>
              </>
            )}

            {user?.role === 'user' && (
              <>
                <Link to="/my-bookings" className="text-foreground hover:underline">Foglalásaim</Link>
              </>
            )}

            {user?.role === 'admin' && (
              <>
                <Link to="/add-table" className="text-foreground hover:underline">Asztal hozzáadása</Link>
                <Link to="/admin/bookings" className="text-foreground hover:underline">Beérkezett foglalások</Link>
              </>
            )}
          </nav>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {user.name} {user.role === 'admin' ? '(Admin)' : ''}
            </span>
            <button 
              onClick={handleLogout}
              className="rounded bg-background px-3 py-1 text-chart-4 hover:bg-foreground hover:text-background flex items-center gap-1"
            >
              Kijelentkezés
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;