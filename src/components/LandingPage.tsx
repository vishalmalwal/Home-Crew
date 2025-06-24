import React, { useState } from 'react';
import { Users, Building, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState<'customer' | 'company' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useApp();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (showLogin && login(email, password, showLogin)) {
      setShowLogin(null);
      setEmail('');
      setPassword('');
    } else {
      alert('Invalid credentials!');
    }
  };

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
        {!showLogin ? (
          <div>
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
            <div className="text-center">
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

            {/* Cities */}
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">We Serve Major Indian Cities</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'].map(city => (
                  <span key={city} className="bg-white px-4 py-2 rounded-full text-sm border border-gray-200">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              {showLogin === 'customer' ? 'Customer Login' : 'Company Login'}
            </h3>
            
            {showLogin === 'company' && (
              <div className="bg-blue-50 p-4 rounded-lg mb-4 text-sm">
                <p><strong>Demo Credentials:</strong></p>
                <p>Email: admin@homecrew.com</p>
                <p>Password: admin123</p>
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
            
            <button
              onClick={() => setShowLogin(null)}
              className="w-full mt-4 text-gray-600 hover:text-gray-800"
            >
              Back to Home
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default LandingPage;