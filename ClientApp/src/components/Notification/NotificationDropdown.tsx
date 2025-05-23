import {
  getUserNotifications,
  markNotificationAsRead,
} from '@/apis/notification';
import { usePageRedirection } from '@/hooks/usePageRedirection';
import { Notifications } from '@/types/Notification/Notifications';
import React, { useEffect, useState } from 'react';

const NotificationDropdown: React.FC = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const redirect = usePageRedirection();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getUserNotifications();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      await Promise.all(unreadIds.map((id) => markNotificationAsRead(id)));
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all notifications as read', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <li className="nav-item dropdown me-3">
      <a
        className="nav-link position-relative"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        title={`${unreadCount} unread notification${
          unreadCount !== 1 ? 's' : ''
        }`}
      >
        <i className="bi bi-bell fs-5"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
            {unreadCount}
          </span>
        )}
      </a>

      <ul
        className={`dropdown-menu dropdown-menu-end shadow-lg p-0 ${
          isOpen ? 'show' : ''
        }`}
        style={{
          minWidth: '360px',
          maxHeight: '500px',
          overflowY: 'auto',
          border: 'none',
          borderRadius: '12px',
        }}
      >
        <li className="dropdown-header bg-light py-3 px-4 d-flex justify-content-between align-items-center sticky-top">
          <div className="d-flex align-items-center">
            <i className="bi bi-bell-fill text-primary me-2"></i>
            <span className="fw-semibold fs-6">Notifications</span>
          </div>
          <div>
            {unreadCount > 0 && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={markAllAsRead}
                title="Mark all as read"
              >
                Mark all read
              </button>
            )}
          </div>
        </li>

        <hr className="my-0" />

        {loading ? (
          <li className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2 text-muted">Loading notifications</p>
          </li>
        ) : notifications.length === 0 ? (
          <li className="text-center py-4">
            <i className="bi bi-check-circle-fill text-success fs-3 mb-2"></i>
            <p className="text-muted">No new notifications</p>
          </li>
        ) : (
          <div className="p-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`d-flex justify-content-between align-items-start p-3 ${
                  n.isRead ? 'bg-white' : ' bg-opacity-05'
                } rounded-3 mb-2 transition-all`}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  borderLeft: n.isRead ? 'none' : '3px solid var(--bs-primary)',
                }}
                // onClick={() => {
                //   if (!n.isRead) markAsRead(n.id);
                //   redirect(n.link || 'notification');
                // }}
                onClick={() => {
                  if (!n.isRead) markAsRead(n.id);

                  if (n.folderId) {
                    redirect(`/folders/${n.folderId}`);
                  } else {
                    redirect('notification');
                  }
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateX(2px)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div className="d-flex align-items-start flex-grow-1">
                  <div
                    className={`flex-shrink-0 me-3 ${
                      n.isRead ? 'text-muted' : 'text-primary'
                    }`}
                  >
                    <i
                      className={`bi ${
                        n.isRead
                          ? 'bi-info-circle'
                          : 'bi-exclamation-circle-fill'
                      } fs-4`}
                    ></i>
                  </div>
                  <div className="flex-grow-1">
                    <p
                      className={`mb-1 ${
                        n.isRead ? 'text-muted' : 'fw-semibold'
                      }`}
                      style={{ fontSize: '0.9rem' }}
                    >
                      {n.message}
                    </p>
                    <small className="text-muted d-block">
                      <i className="bi bi-clock me-1"></i>
                      {new Date(n.created).toLocaleString()}
                    </small>
                  </div>
                </div>
                {!n.isRead && (
                  <button
                    className="btn btn-sm btn-icon ms-2 align-self-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(n.id);
                    }}
                    aria-label="Mark as read"
                    title="Mark as read"
                  >
                    <i className="bi bi-check-lg text-primary"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <hr className="my-0" />

        <li className="text-center py-2 bg-light rounded-bottom-3">
          <button
            className="btn btn-sm btn-link text-primary fw-semibold d-flex align-items-center justify-content-center mx-auto"
            onClick={() => redirect('notification')}
          >
            <i className="bi bi-list-ul me-2"></i>
            View All Notifications
          </button>
        </li>
      </ul>
    </li>
  );
};

export default NotificationDropdown;
