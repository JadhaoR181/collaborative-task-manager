import { useNotifications } from "../hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "./NotificationSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

interface NotificationsPanelProps {
  onClose?: () => void;
}

export default function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const { data, isLoading } = useNotifications();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden max-h-[70vh] sm:max-h-[500px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {!isLoading && data && data.length > 0 && (
                <p className="text-xs text-gray-500">
                  {data.filter(n => !n.read).length} unread
                </p>
              )}
            </div>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/80 transition-colors touch-manipulation"
            aria-label="Close notifications"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          {isLoading && (
            <div className="divide-y divide-gray-100">
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          )}

          {!isLoading && data?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                No notifications yet
              </p>
              <p className="text-xs text-gray-500 text-center">
                We'll notify you when something important happens
              </p>
            </div>
          )}

          {!isLoading && data && data.length > 0 && (
            <div className="divide-y divide-gray-100">
              {data.map(n => (
                <NotificationItem key={n.id} notification={n} />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Optional */}
        {!isLoading && data && data.length > 0 && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-center">
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors touch-manipulation">
              Mark all as read
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}