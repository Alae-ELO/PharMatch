import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, User, Menu, X, LogOut, Settings, Pill } from 'lucide-react';
import useStore from '../../store';
import Badge from '../ui/Badge';

const Header: React.FC = () => {
  const { currentUser, notifications, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Find Pharmacies', path: '/pharmacies' },
    { title: 'Medications', path: '/medications' },
    { title: 'Blood Donation', path: '/blood-donation' },
    { title: 'Health Assistant', path: '/chat' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-sm bg-white/75 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Pill className="h-8 w-8 text-cyan-600" />
              <span className="text-xl font-bold text-gray-900">PharMatch</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-cyan-600 ${
                  location.pathname === link.path ? 'text-cyan-600' : 'text-gray-700'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </nav>

          {/* Right Side Items */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-11 w-80 rounded-md border border-gray-200 bg-white p-2 shadow-lg">
                  <div className="mb-2 px-2 py-1.5 text-sm font-medium">Notifications</div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-3 text-center text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`mb-2 rounded-md p-3 ${notification.read ? 'bg-gray-50' : 'bg-cyan-50'}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500">{notification.message}</p>
                            </div>
                            {!notification.read && <Badge variant="primary">New</Badge>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="mt-2 border-t border-gray-200 pt-2 text-center">
                      <Link 
                        to="/notifications" 
                        className="text-xs font-medium text-cyan-600 hover:text-cyan-800"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Menu (Desktop) */}
            {currentUser ? (
              <div className="relative hidden md:block">
                <button
                  onClick={toggleProfile}
                  className="flex items-center space-x-2 rounded-full p-2 text-gray-700 hover:bg-gray-100"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="rounded-full bg-cyan-100 p-1">
                    <User className="h-5 w-5 text-cyan-700" />
                  </div>
                  <span className="text-sm font-medium">{currentUser.name}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 top-11 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
                    <div className="border-b border-gray-200 px-4 py-2">
                      <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Settings
                    </Link>
                    {currentUser.role === 'pharmacy' && (
                      <Link
                        to="/pharmacy/dashboard"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Pharmacy Dashboard
                      </Link>
                    )}
                    {currentUser.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:block">
                <Link 
                  to="/login" 
                  className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
                >
                  Login / Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block rounded-md px-3 py-2 text-base font-medium ${
                    location.pathname === link.path
                      ? 'bg-cyan-50 text-cyan-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
              
              {currentUser ? (
                <>
                  <div className="border-t border-gray-200 pt-4 pb-3">
                    <div className="flex items-center px-4">
                      <div className="flex-shrink-0 rounded-full bg-cyan-100 p-1">
                        <User className="h-6 w-6 text-cyan-700" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{currentUser.name}</div>
                        <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      <Link
                        to="/profile"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      {currentUser.role === 'pharmacy' && (
                        <Link
                          to="/pharmacy/dashboard"
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Pharmacy Dashboard
                        </Link>
                      )}
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-red-600 hover:bg-gray-50"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 pb-3">
                  <Link
                    to="/login"
                    className="block rounded-md bg-cyan-600 px-3 py-2 text-center text-base font-medium text-white hover:bg-cyan-700"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;