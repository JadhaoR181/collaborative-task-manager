import {
  Bell,
  LayoutList,
  LogOut,
  User,
  Menu,
  X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationsPanel from "./NotificationsPanel";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";




export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [shake, setShake] = useState(false);
const prevUnreadRef = useRef<number>(0);
const notifRef = useRef<HTMLDivElement | null>(null);


  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const { data: notifications } = useNotifications();

const unreadCount =
  notifications?.filter(n => !n.read).length ?? 0;




  /* ───────────────── Outside click ───────────────── */
  useEffect(() => {
   
    const handler = (e: MouseEvent | TouchEvent) => {
      if (unreadCount > prevUnreadRef.current) {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  }
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
      prevUnreadRef.current = unreadCount;
    };
  }, [unreadCount]);

  /* ───────────────── Handlers ───────────────── */
  const toggleNotifications = async () => {
    const next = !notificationsOpen;
    setNotificationsOpen(next);

    if (next && unreadCount > 0) {
      try {
        await api.post("/notifications/read");
      } catch (err) {
        console.error("Failed to mark notifications as read", err);
      }
    }
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
    navigate("/login");
  };

  /* ───────────────── UI ───────────────── */
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* ───── Brand ───── */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <LayoutList className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg text-indigo-600">
                TaskMaster<span className="text-gray-900">X</span>
              </p>
              <p className="hidden sm:block text-xs text-gray-500">
                Collaborative Task Manager
              </p>
            </div>
          </div>

          {/* ───── Right Side ───── */}
          <div className="flex items-center gap-2">
            {/* 🔔 Notification Bell (VISIBLE ON MOBILE + DESKTOP) */}
            <div className="relative" ref={notifRef}>
             <button
  onClick={toggleNotifications}
  className="relative p-2 rounded-full hover:bg-gray-100 transition focus:outline-none"
>
  <motion.div
    animate={
      shake
        ? { rotate: [0, -15, 15, -10, 10, 0] }
        : {}
    }
    transition={{ duration: 0.6 }}
  >
    <Bell className="w-5 h-5 text-gray-700" />
  </motion.div>

  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
      {unreadCount}
    </span>
  )}
</button>


              {notificationsOpen && (
                <NotificationsPanel
                  onClose={() => setNotificationsOpen(false)}
                />
              )}
            </div>

            {/* ☰ Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(p => !p)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l">
             <div
  onClick={() => navigate("/profile")}
  className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-indigo-300 transition"
>
  <User className="w-4 h-4 text-indigo-600" />
</div>

              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>

        {/* ───── Mobile Menu ───── */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t pt-4 space-y-4">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
             {/* Profile */}
    <button
      onClick={() => {
        setMobileMenuOpen(false);
        navigate("/profile");
      }}
      className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-100"
    >
      <User className="w-5 h-5 text-indigo-600" />
      <span className="text-sm font-medium">Profile</span>
    </button>

            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
