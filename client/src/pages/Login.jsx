import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (await login(username, password)) {
      navigate('/');
    } else {
      alert('Login failed');
    }
  };

  return (
    <div className='bg-[#0F0F0F]'>
      <Header />
      <div className="flex items-center justify-center min-h-screen ">
        
        
        <form onSubmit={handleSubmit} className="p-6 bg-[#2A2A2A] rounded shadow-md border border-[#8791A3]">
        <h2 className='text-[#FFFFFF] text-2xl font-bold mb-2'>Login to M3D Admin</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 mb-4 border rounded"
          />
          <button type="submit" className="primary-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;