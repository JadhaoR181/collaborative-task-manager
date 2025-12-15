import { useNotifications } from "../hooks/useNotifications";
import NotificationItem from "./NotificationItem";
import NotificationSkeleton from "./NotificationSkeleton";

export default function NotificationsPanel() {
  const { data, isLoading } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-50">
      <div className="px-4 py-2 font-semibold border-b">
        Notifications
      </div>

      {isLoading && (
        <>
          <NotificationSkeleton />
          <NotificationSkeleton />
          <NotificationSkeleton />
        </>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="p-4 text-sm text-gray-500">
          No notifications
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
  );
}
