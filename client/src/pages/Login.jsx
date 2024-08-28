import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import Header from '../components/Header';
import { FaExclamationTriangle } from 'react-icons/fa';


function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (await login(username, password)) {
      const params = new URLSearchParams(location.search);
      const nextPath = params.get('next') || '/';
      navigate(nextPath);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className='bg-[#0F0F0F] min-h-screen'>
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
        <form onSubmit={handleSubmit} className="p-6 bg-[#2A2A2A] rounded shadow-md border border-[#8791A3] w-full max-w-md">
          <h2 className='text-white text-2xl font-bold mb-4'>Login to Mandarin 3D</h2>
          <p className='text-white text-sm mb-4 opacity-70'>Please enter your username and password to access the admin panel.</p>
          
          {error && (
            <div className="bg-red-500 text-white p-3 rounded mb-4 flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </div>
          )}

          <p className='text-white text-sm mb-2'>Username:</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded bg-[#3A3A3A] text-white"
          />
          <p className='text-white text-sm mb-2'>Password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded bg-[#3A3A3A] text-white"
          />
          <button type="submit" className="w-full primary-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;