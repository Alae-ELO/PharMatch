import './i18n';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './store';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Pages
import Home from './pages/Home';
import PharmaciesPage from './pages/PharmaciesPage';
import PharmacyDetailsPage from './pages/PharmacyDetailsPage';
import MedicationsPage from './pages/MedicationsPage';
import MedicationDetailsPage from './pages/MedicationDetailsPage';
import ChatPage from './pages/ChatPage';
import BloodDonationPage from './pages/BloodDonationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PharmacyDashboard from './pages/PharmacyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { useTranslation } from 'react-i18next';

// Auth Route wrapper
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  role?: 'user' | 'pharmacy' | 'admin';
}> = ({ children, role }) => {
  const { currentUser, checkAuth } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    verifyAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
    </div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (role && currentUser.role !== role) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { i18n } = useTranslation();
  const { checkAuth } = useStore();

  useEffect(() => {
    document.body.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="pharmacies" element={<PharmaciesPage />} />
          <Route path="pharmacies/:id" element={<PharmacyDetailsPage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="medications/:id" element={<MedicationDetailsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="blood-donation" element={<BloodDonationPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="pharmacy/dashboard" 
            element={
              <ProtectedRoute role="pharmacy">
                <PharmacyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="admin" 
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<div className="container mx-auto px-4 py-16 text-center"><h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;