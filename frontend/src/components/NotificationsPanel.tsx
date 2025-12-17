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

  const unreadCount = data?.filter(n => !n.read).length ?? 0;

  return (
    <AnimatePresence>
      {/* Overlay (mobile only) */}
      <motion.div
        className="fixed inset-0 bg-black/30 z-40 sm:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="
          fixed sm:absolute z-50
          bottom-0 sm:bottom-auto
          right-0 sm:right-0
          w-full sm:w-96
          max-h-[75vh] sm:max-h-[480px]
          bg-white
          rounded-t-2xl sm:rounded-xl
          shadow-xl border
          flex flex-col
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="text-xs text-gray-500">
                ({unreadCount})
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto divide-y">
          {isLoading && (
            <>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </>
          )}

          {!isLoading && data?.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              You’re all caught up 🎉
            </div>
          )}

          {!isLoading &&
            data?.map(notification => (
              <NotificationItem
                key={notification.id}
                notification={notification}
              />
            ))}
        </div>

        {/* Footer */}
        {!isLoading && data && data.length > 0 && (
          <div className="border-t px-4 py-2 text-center">
            <button className="text-xs font-medium text-indigo-600 hover:underline">
              Mark all as read
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
