import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, User, LogOut, Menu, X, Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <header className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-white hover:text-purple-200 transition-colors">
            <Shield className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              KYC Platform
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-white hover:text-purple-200 transition-colors ${isActivePath('/') ? 'text-purple-300' : ''}`}
            >
              Home
            </Link>
            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link 
                    to="/kyc-portal" 
                    className={`text-white hover:text-purple-200 transition-colors ${isActivePath('/kyc-portal') ? 'text-purple-300' : ''}`}
                  >
                    KYC Portal
                  </Link>
                )}
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className={`text-white hover:text-purple-200 transition-colors ${isActivePath('/admin') ? 'text-purple-300' : ''}`}
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`text-white hover:text-purple-200 transition-colors ${isActivePath('/login') ? 'text-purple-300' : ''}`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <button className="text-white hover:text-purple-200 transition-colors p-2 rounded-lg hover:bg-white/10">
                <Bell className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={user.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150&h=150&fit=crop'} 
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-purple-400"
                />
                <div className="text-white">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-purple-200 capitalize">{user.role}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-white/10"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-purple-200 transition-colors p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-lg border-t border-white/20 mt-2 rounded-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                className="block px-3 py-2 text-white hover:text-purple-200 transition-colors rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {user ? (
                <>
                  {user.role === 'customer' && (
                    <Link 
                      to="/kyc-portal" 
                      className="block px-3 py-2 text-white hover:text-purple-200 transition-colors rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      KYC Portal
                    </Link>
                  )}
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block px-3 py-2 text-white hover:text-purple-200 transition-colors rounded-md"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="flex items-center space-x-3 px-3 py-2 border-t border-white/20 mt-2">
                    <img 
                      src={user.avatar || 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=150&h=150&fit=crop'} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full border-2 border-purple-400"
                    />
                    <div className="text-white flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-purple-200 capitalize">{user.role}</p>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-white hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-white/10"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block px-3 py-2 text-white hover:text-purple-200 transition-colors rounded-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="block px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md font-medium hover:shadow-lg transition-all duration-200 mx-3 my-2 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};