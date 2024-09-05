import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './components/Admin.jsx';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { AlertProvider } from './context/AlertContext';
import AlertManager from './components/AlertManager'; // Add this import
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { CartProvider } from './context/Cart';
import Loading from 'react-fullscreen-loading';
import { Analytics } from "@vercel/analytics/react"
// 

console.log(`${process.env.REACT_APP_BACKEND_URL}`)

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <Loading loading background="#0F0F0F" loaderColor="#FFFFFF" />;
  }
  
  return isAuthenticated ? children : <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} />;
};

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/?code=C01" /> : <Login />;
};

function App() {
  return (
    <AlertProvider>
      <CartProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Routes>
            <AlertManager /> 
          </Router>
        </AuthProvider>
      </CartProvider>
    </AlertProvider>
  );
}

export default App;