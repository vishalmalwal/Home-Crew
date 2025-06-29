import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, Phone, Mail, MapPin, Star, CheckCircle, Clock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState<'customer' | 'company' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!showLogin) {
      setError('Please select user type');
      return;
    }

    if (login(email, password, showLogin)) {
      setShowLogin(null);
      setEmail('');
      setPassword('');
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
        <header className="bg-white shadow-sm border-b-2 border-blue-200">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">HomeCrew</h1>
                  <p className="text-sm text-gray-600">Your Trusted Home Service Partners</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>+91-1800-HOMECREW</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>help@homecrew.com</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex items-center justify-center py-20">
          <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 ${showLogin === 'customer' ? 'bg-blue-100' : 'bg-orange-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {showLogin === 'customer' ? (
                  <Users className="w-8 h-8 text-blue-600" />
                ) : (
                  <Building className="w-8 h-8 text-orange-600" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                {showLogin === 'customer' ? 'Customer Login' : 'Company Login'}
              </h2>
              <p className="text-gray-600 mt-2">
                {showLogin === 'customer' ? 'Access your dashboard and book services' : 'Manage your workers and bookings'}
              </p>
            </div>

            {showLogin === 'company' && (
              <div className="bg-orange-50 p-4 rounded-lg mb-6 text-sm">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: admin@homecrew.com</p>
                <p>Password: admin123</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
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
                />
              </div>

              <button
                type="submit"
                className={`w-full ${showLogin === 'customer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-orange-600 hover:bg-orange-700'} text-white py-3 rounded-lg font-semibold transition-colors`}
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center space-y-4">
              {showLogin === 'customer' && (
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Register here
                  </Link>
                </p>
              )}
              
              <button
                onClick={() => setShowLogin(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-blue-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-600">HomeCrew</h1>
                <p className="text-sm text-gray-600">Your Trusted Home Service Partners</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+91-1800-HOMECREW</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>help@homecrew.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Professional Home Services Across India
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect with skilled carpenters, plumbers, and electricians in your city
          </p>
          
          {/* Service Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Carpentry</h3>
              <p className="text-gray-600">Furniture repair, door installation, custom woodwork</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plumbing</h3>
              <p className="text-gray-600">Pipe repairs, installations, drainage solutions</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Electrical</h3>
              <p className="text-gray-600">Wiring, installations, appliance setup</p>
            </div>
          </div>
        </div>

        {/* Login Options */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold mb-6">Choose Your Access</h3>
          <div className="flex justify-center space-x-6">
            <button
              onClick={() => setShowLogin('customer')}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
            >
              <Users className="w-6 h-6 inline-block mr-2" />
              I'm a Customer
            </button>
            <button
              onClick={() => setShowLogin('company')}
              className="bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors shadow-lg"
            >
              <Building className="w-6 h-6 inline-block mr-2" />
              Company Login
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Workers</h3>
            <p className="text-gray-600">All professionals are background verified</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">On-Time Service</h3>
            <p className="text-gray-600">Punctual service delivery guaranteed</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
            <p className="text-gray-600">High-quality work with satisfaction guarantee</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Booking</h3>
            <p className="text-gray-600">Safe and secure online booking system</p>
          </div>
        </div>

        {/* Cities */}
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">We Serve Major Indian Cities</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'].map(city => (
              <span key={city} className="bg-white px-4 py-2 rounded-full text-sm border border-gray-200">
                {city}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;