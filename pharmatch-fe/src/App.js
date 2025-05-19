import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useStore from './components/store';

// Layout
import MainLayout from './components/Layout/Main';

// Pages
import Home from './components/pages/Home';
import PropTypes from 'prop-types';
import PharmaciesPage from './components/pages/PharmaciesPage';
import MedicationsPage from './components/pages/MedicationsPage';
import ChatPage from './components/pages/ChatPage';
import BloodDonationPage from './components/pages/BloodDonationPage';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import PharmacyDashboard from './components/pages/PharmacyDashboard';
import AdminDashboard from './components/pages/AdminDashboard';

// Auth Route wrapper
const ProtectedRoute = ({ children, role }) => {
  const { currentUser } = useStore();
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (role && currentUser.role !== role) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  role: PropTypes.oneOf(['user', 'pharmacy', 'admin'])
};



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="pharmacies" element={<PharmaciesPage />} />
          <Route path="medications" element={<MedicationsPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="blood-donation" element={<BloodDonationPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
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