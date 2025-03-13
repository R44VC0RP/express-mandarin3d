import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Input } from '../components/ui/input';
import { FaExclamationTriangle, FaLock, FaUser } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex-grow relative z-10">
        <section className="relative mx-auto max-w-screen-2xl px-4 py-12 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] animate-[gradient_3s_linear_infinite]" />
          </div>

          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-3 py-1 mb-4 rounded-full bg-gradient-to-r from-cyan-500/10 to-cyan-500/0 border border-cyan-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mr-2 animate-pulse" />
                <span className="text-xs font-semibold tracking-wide text-cyan-500 uppercase">
                  Admin Access
                </span>
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                Login to Mandarin 3D
              </h1>
              <p className="text-sm text-white/60 max-w-2xl mx-auto">
                Please enter your credentials to access the admin panel
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4 bg-[#1a1b1e]/80 p-6 rounded-xl border border-neutral-800/50 backdrop-blur-sm">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center text-sm">
                    <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-neutral-500" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full bg-[#2A2A2A] border-neutral-800 focus:border-cyan-500/50 text-white h-9 pl-9"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-neutral-500" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-[#2A2A2A] border-neutral-800 focus:border-cyan-500/50 text-white h-9 pl-9"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full px-6 py-2.5 bg-[#466F80] hover:bg-[#0B7F86] text-white rounded-full transition-all duration-300 flex items-center justify-center group text-sm mt-6"
                >
                  Login to Dashboard
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Login;