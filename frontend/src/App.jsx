import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/UserLoginPage";
import Dashboard from "./pages/Dashboard";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./middleware/ProtectedRotue";

export default function App() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
    </Routes>
  );
}
