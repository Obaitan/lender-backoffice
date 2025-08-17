'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Bell, BellRing, Eye, X, CheckCheck } from 'lucide-react';
import { formatDate, truncateString } from '@/utils/functions';
import Link from 'next/link';
import {
  getUserNotifications,
  markMessagesAsRead,
  UserNotification,
} from '@/services/apiQueries/notificationsApi';
import { AuthService } from '@/services/authService';
import { toast } from 'react-toastify';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationCountChange: (count: number) => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}

const NotificationDropdown = ({
  isOpen,
  onClose,
  onNotificationCountChange,
  anchorRef,
}: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMarkingRead, setIsMarkingRead] = useState<string | null>(null);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Expose a way to set the anchor element from parent
  useEffect(() => {
    if (!isOpen) return;
    if (!anchorRef.current || !dropdownRef.current) return;
    const anchorRect = anchorRef.current.getBoundingClientRect();
    const dropdownWidth = 320;
    const mobileBreakpoint = 640; // Tailwind's sm breakpoint
    if (window.innerWidth <= mobileBreakpoint) {
      // Mobile: anchor to right edge with margin
      setDropdownStyle({
        position: 'fixed',
        top: anchorRect.bottom + 8,
        right: 8,
        left: 'auto',
        zIndex: 9999,
        width: `calc(100vw - 16px)`, // 8px margin on both sides
        maxWidth: dropdownWidth,
        maxHeight: '24rem',
        overflow: 'hidden',
      });
    } else {
      // Desktop: anchor to button, right-aligned
      setDropdownStyle({
        position: 'fixed',
        top: anchorRect.bottom + 8, // 8px gap
        left: anchorRect.right - dropdownWidth,
        zIndex: 9999,
        width: dropdownWidth,
        maxHeight: '24rem',
        overflow: 'hidden',
      });
    }
  }, [isOpen, anchorRef]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      // Get current user email
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser?.email) {
        throw new Error('User email not available');
      }

      const response = await getUserNotifications(currentUser.email, 1, 10); // Get latest 10 notifications
      setNotifications(response.data);

      // Update unread count
      const unreadCount = response.data.filter((n) => !n.read).length;
      onNotificationCountChange(unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      onNotificationCountChange(0);
    } finally {
      setIsLoading(false);
    }
  }, [onNotificationCountChange]);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = async (
    notificationId: string,
    event: React.MouseEvent
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification || notification.read) return;

    try {
      setIsMarkingRead(notificationId);
      await markMessagesAsRead([notificationId]);

      // Update local state
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );

      // Update unread count
      const newUnreadCount = notifications.filter(
        (n) => n.id !== notificationId && !n.read
      ).length;
      onNotificationCountChange(newUnreadCount);

      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      setIsMarkingRead(null);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    if (unreadNotifications.length === 0) return;

    try {
      setIsMarkingAllRead(true);
      const unreadIds = unreadNotifications.map((n) => n.id);
      await markMessagesAsRead(unreadIds);

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

      // Update unread count
      onNotificationCountChange(0);

      toast.success(`Marked ${unreadIds.length} notifications as read`);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const dropdown = (
    <div
      ref={dropdownRef}
      style={dropdownStyle}
      className="bg-white rounded-lg shadow-lg border border-gray-200 z-[9999] max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-secondary-100 text-secondary-600 text-xs px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              disabled={isMarkingAllRead}
              className="text-xs text-secondary-600 hover:text-secondary-700 font-medium disabled:opacity-50"
              title="Mark all as read"
            >
              {isMarkingAllRead ? (
                <div className="w-4 h-4 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCheck className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-secondary-200 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !notification.read ? 'bg-secondary-25' : ''
                }`}
                onClick={() => {
                  // Navigate to notifications page
                  window.location.href = '/notifications/received';
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      !notification.read
                        ? 'bg-secondary-100 text-secondary-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {!notification.read ? (
                      <BellRing className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`text-sm font-medium truncate ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}
                      >
                        {notification.subject}
                      </h4>

                      {!notification.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                          disabled={isMarkingRead === notification.id}
                          className="flex-shrink-0 text-gray-400 hover:text-secondary-600 transition-colors"
                          title="Mark as read"
                        >
                          {isMarkingRead === notification.id ? (
                            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Eye className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {truncateString(notification.content, 60)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">
                        From: {notification.from}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(notification.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <Link
            href="/notifications"
            className="text-sm text-secondary-600 hover:text-secondary-700 font-medium block text-center"
            onClick={onClose}
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );

  return typeof window !== 'undefined' && document.body
    ? createPortal(dropdown, document.body)
    : null;
};

// Add a way to set the anchor ref from parent
export default NotificationDropdown;
