import { useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "./NotificationsPanel";
import { useNotifications } from "../hooks/useNotifications";


export default function Navbar() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data: notifications } = useNotifications();

  const unreadCount =
    notifications?.filter(n => !n.read).length ?? 0;

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">
          Collaborative Task Manager
        </h1>

        <div className="flex items-center gap-4 relative">
          {/* 🔔 Notification Bell */}
          <button
            onClick={() => setOpen(o => !o)}
            className="relative"
          >
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                {unreadCount}
              </span>
            )}
          </button>

          {open && <NotificationsPanel />}

          <span className="text-sm">{user?.name}</span>

          <button
            onClick={logout}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
