import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ChatLayout from './components/ChatLayout';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

// A wrapper to protect routes
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  const { currentUser } = useAuth();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" replace /> : <Login />} />
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <ChatLayout />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
