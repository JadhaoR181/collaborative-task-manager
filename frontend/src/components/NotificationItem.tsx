import { Notification } from "../hooks/useNotifications";

export default function NotificationItem({
  notification
}: {
  notification: Notification;
}) {
  return (
    <div
      className={`p-3 border-b text-sm ${
        notification.read ? "bg-white" : "bg-indigo-50"
      }`}
    >
      <p className="text-gray-800">{notification.message}</p>
      <span className="text-xs text-gray-400">
        {new Date(notification.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
