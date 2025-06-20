import {
  getUserNotifications,
  markNotificationAsRead,
} from '@/apis/notification';
import Footer from '@/components/Layout/Footer/footer';
import RoleBasedHeader from '@/components/Layout/Header/RoleBasedHeader';
import { Notifications } from '@/types/Notification/Notifications';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <Container>
        <RoleBasedHeader />
        <MainContent>
          <div className="container mt-5 mb-5">
            <h3 className="mb-4">All Notifications</h3>
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p>No notifications found.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded shadow-sm d-flex justify-content-between align-items-start ${
                      n.isRead
                        ? 'bg-light'
                        : 'bg-white border-start border-4 border-primary'
                    }`}
                  >
                    <div>
                      <i
                        className={`bi me-2 ${
                          n.isRead
                            ? 'bi-info-circle text-secondary'
                            : 'bi-bell-fill text-primary'
                        }`}
                      ></i>
                      <span className={n.isRead ? 'text-muted' : 'fw-bold'}>
                        {n.message}
                      </span>
                    </div>
                    {!n.isRead && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => markAsRead(n.id)}
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </MainContent>
        <Footer />
      </Container>
    </>
  );
};

export default NotificationPage;
const Container = styled.div`
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
`;
