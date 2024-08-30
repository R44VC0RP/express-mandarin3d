import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/Cart';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} />;
};

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/?code=C01" /> : <Login />;
};

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;