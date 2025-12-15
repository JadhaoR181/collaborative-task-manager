import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.error("Logout failed", err);
  } finally {
    setUser(null);
    navigate("/login");
  }
};


  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">
          Collaborative Task Manager
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {user?.name.toUpperCase()}
          </span>
          <button
            onClick={logout}
            className="px-3 py-1 text-sm rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
