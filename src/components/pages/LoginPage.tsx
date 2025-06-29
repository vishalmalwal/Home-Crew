import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Users, Building, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialUserType = searchParams.get('type') as 'customer' | 'company' | null;
  
  const [userType, setUserType] = useState<'customer' | 'company' | null>(initialUserType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userType) {
      setError('Please select user type');
      setLoading(false);
      return;
    }

    try {
      const success = await login(email, password, userType);
      if (success) {
        if (userType === 'customer') {
          navigate('/dashboard');
        } else {
          navigate('/admin');
        }
      } else {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Choose Login Type</h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setUserType('customer')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
              >
                <Users className="w-6 h-6" />
                <span>Customer Login</span>
              </button>
              
              <button
                onClick={() => setUserType('company')}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
              >
                <Building className="w-6 h-6" />
                <span>Company Login</span>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link to="/" className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      <div className="flex items-center justify-center py-20">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center mb-8">
            <div className={`w-16 h-16 ${userType === 'customer' ? 'bg-blue-100' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
              {userType === 'customer' ? (
                <Users className="w-8 h-8 text-blue-600" />
              ) : (
                <Building className="w-8 h-8 text-orange-600" />
              )}
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              {userType === 'customer' ? 'Customer Login' : 'Company Login'}
            </h2>
            <p className="text-gray-600 mt-2">
              {userType === 'customer' ? 'Access your dashboard and book services' : 'Manage your workers and bookings'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {userType === 'company' && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mb-6 text-sm">
              <p className="text-orange-800"><strong>Demo Company Login:</strong></p>
              <p className="text-orange-700">Email: admin@homecrew.com</p>
              <p className="text-orange-700">Password: admin123</p>
            </div>
          )}

          {userType === 'customer' && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6 text-sm">
              <p className="text-blue-800"><strong>Customer Registration:</strong></p>
              <p className="text-blue-700">New customers can register for free!</p>
              <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Create your account here →
              </Link>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${userType === 'customer' ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'} text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            {userType === 'customer' && (
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Register here
                </Link>
              </p>
            )}
            
            <button
              onClick={() => setUserType(null)}
              className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Change Login Type</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;