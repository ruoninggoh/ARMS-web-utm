import { logoutUser } from '@/apis/auth';
import NotificationDropdown from '@/components/Notification/NotificationDropdown';
import { usePageRedirection } from '@/hooks/usePageRedirection';
import { useUserRole } from '@/hooks/useUserRole';
import FcLogo from '@/images/landing/fcLogo2.png';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';

const RoleBasedHeader: React.FC = () => {
  const redirect = usePageRedirection();
  const role = useUserRole(); // Get the current user's role

  const handleDashboard = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    redirect('dashboard');
  };

  const handleAboutUs = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    redirect('about');
  };

  const handleAcademic = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    redirect('academic');
  };

  const handleApproval = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    redirect('approval');
  };

  const handleUser = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    redirect('admin/userManagement');
  };

  const handleProfileRedirect = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    event.preventDefault();
    redirect('profile');
  };

  const handleLogOut = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    logoutUser();
    redirect('login');
  };

  // Determine which tabs to show based on role
  const showUserManagement = role === 'admin';
  const showApproval = [
    'admin',
    'head of department',
    'deputy dean',
    'dean',
  ].includes(role);
  const showAcademic = [
    'admin',
    'head of department',
    'deputy dean',
    'dean',
    'lecturer',
  ].includes(role);

  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container-fluid">
        {/* Logo and Title */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src={FcLogo}
            alt="UTM Logo"
            className="d-inline-block align-text-top me-2"
            style={{ maxWidth: '380px', height: 'auto' }}
          />
        </a>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          {/* Center Aligned Links */}
          <ul className="navbar-nav mx-4">
            <li className="nav-item mx-4">
              <a
                className="nav-link"
                onClick={handleDashboard}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                Dashboard
              </a>
            </li>
            <li className="nav-item mx-4">
              <a
                className="nav-link"
                onClick={handleAboutUs}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                About Us
              </a>
            </li>

            {showAcademic && (
              <li className="nav-item mx-4">
                <a
                  className="nav-link"
                  onClick={handleAcademic}
                  role="button"
                  style={{ cursor: 'pointer' }}
                >
                  Academic Management
                </a>
              </li>
            )}

            {showApproval && (
              <li className="nav-item mx-4">
                <a
                  className="nav-link"
                  onClick={handleApproval}
                  role="button"
                  style={{ cursor: 'pointer' }}
                >
                  Approval Status
                </a>
              </li>
            )}

            {showUserManagement && (
              <li className="nav-item mx-4">
                <a
                  className="nav-link"
                  onClick={handleUser}
                  role="button"
                  style={{ cursor: 'pointer' }}
                >
                  User Management
                </a>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {/* Notification */}
            <NotificationDropdown />

            {/* Profile */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle fs-5"></i>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" onClick={handleProfileRedirect}>
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleLogOut}>
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default RoleBasedHeader;
