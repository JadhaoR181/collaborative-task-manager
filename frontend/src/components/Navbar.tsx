import { Bell, LayoutList, LogOut, User, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import NotificationsPanel from "./NotificationsPanel";
import { useNotifications } from "../hooks/useNotifications";
import { useAuth } from "../context/useAuth";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: notifications } = useNotifications();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    
    // Use both mouse and touch events for better mobile support
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  // Toggle notifications & mark as read
  const toggleNotifications = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newState = !notificationsOpen;
    setNotificationsOpen(newState);

    // Mark as read when opening
    if (newState && unreadCount > 0) {
      try {
        await api.post("/notifications/read");
      } catch (error) {
        console.error("Failed to mark notifications as read:", error);
      }
    }
  };

  // Close notifications handler
  const closeNotifications = () => {
    setNotificationsOpen(false);
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <LayoutList className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-indigo-600 font-bold text-xl">TaskMaster</span>
                  <span className="text-gray-800 font-bold text-xl">X</span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Collaborative Task Manager
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifications}
                onTouchEnd={toggleNotifications}
                className="relative p-2.5 rounded-xl hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 touch-manipulation"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="w-5 h-5 text-gray-700" />

                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-semibold shadow-lg animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && <NotificationsPanel onClose={closeNotifications} />}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>

              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={logout}
                className="p-2.5 rounded-xl hover:bg-red-50 transition-colors group touch-manipulation"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4">
            {/* User Info Mobile */}
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
            </div>

            {/* Notifications Mobile */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={toggleNotifications}
                onTouchEnd={toggleNotifications}
                className="w-full flex items-center justify-between px-2 py-2.5 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <span className="text-sm font-medium text-gray-900">
                    Notifications
                  </span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold px-1.5">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && <NotificationsPanel onClose={closeNotifications} />}
            </div>

            {/* Logout Mobile */}
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-red-50 transition-colors text-red-600 touch-manipulation"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}