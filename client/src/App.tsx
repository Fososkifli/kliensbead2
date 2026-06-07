import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RoomPage from "./pages/RoomPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AddTablePage from "./pages/AddTablePage";
import AuthProvider from "./components/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RoomPage />} />
          
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          
          <Route element={<ProtectedRoute roles={['user']} />}>
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
            <Route path="/add-table" element={<AddTablePage />} />
          </Route>

        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;