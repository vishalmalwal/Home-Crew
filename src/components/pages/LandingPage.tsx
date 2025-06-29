import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, Phone, Mail, MapPin, Star, CheckCircle, Clock, Shield, ArrowRight, Zap } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <Building className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HomeCrew</h1>
                <p className="text-sm text-gray-600">Your Trusted Home Service Partners</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4 text-blue-600" />
                <span>+91-1800-HOMECREW</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>help@homecrew.com</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative">
          <div className="mb-8">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Professional Home Services Across India
            </span>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Quality Home Services
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              At Your Doorstep
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect with skilled carpenters, plumbers, and electricians in your city. 
            Professional service, verified workers, guaranteed satisfaction.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link
              to="/register"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Users className="w-6 h-6 mr-2" />
              Book a Service
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="group bg-white text-gray-700 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border border-gray-200 flex items-center justify-center"
            >
              <Building className="w-6 h-6 mr-2" />
              Company Login
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: '500+', label: 'Skilled Workers', color: 'from-blue-500 to-blue-600' },
              { number: '18', label: 'Cities Covered', color: 'from-purple-500 to-purple-600' },
              { number: '10K+', label: 'Happy Customers', color: 'from-green-500 to-green-600' },
              { number: '4.8★', label: 'Average Rating', color: 'from-yellow-500 to-orange-500' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100">
                <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
            <p className="text-xl text-gray-600">Professional solutions for all your home needs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Building,
                title: 'Carpentry',
                description: 'Expert woodworking solutions',
                features: ['Furniture repair & assembly', 'Door & window installation', 'Custom woodwork', 'Cabinet making'],
                color: 'from-blue-500 to-blue-600',
                bgColor: 'from-blue-50 to-blue-100'
              },
              {
                icon: Users,
                title: 'Plumbing',
                description: 'Complete plumbing solutions',
                features: ['Pipe repairs & installations', 'Toilet & basin repair', 'Drainage solutions', 'Water heater services'],
                color: 'from-purple-500 to-purple-600',
                bgColor: 'from-purple-50 to-purple-100'
              },
              {
                icon: MapPin,
                title: 'Electrical',
                description: 'Safe electrical work',
                features: ['Wiring & rewiring', 'Fan & light installation', 'Switch & socket repair', 'Appliance setup'],
                color: 'from-green-500 to-green-600',
                bgColor: 'from-green-50 to-green-100'
              }
            ].map((service, index) => (
              <div key={index} className={`bg-gradient-to-br ${service.bgColor} p-8 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{service.title}</h3>
                <p className="text-gray-600 text-center mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${service.color} text-white`}>
                    Starting from ₹299
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose HomeCrew?</h2>
            <p className="text-xl text-gray-600">Quality service with complete peace of mind</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Verified Workers',
                description: 'All professionals are background verified and skilled',
                color: 'from-blue-500 to-blue-600'
              },
              {
                icon: Clock,
                title: 'On-Time Service',
                description: 'Punctual service delivery as per your scheduled time',
                color: 'from-purple-500 to-purple-600'
              },
              {
                icon: Star,
                title: 'Quality Assured',
                description: 'High-quality work with customer satisfaction guarantee',
                color: 'from-green-500 to-green-600'
              },
              {
                icon: Shield,
                title: 'Secure Booking',
                description: 'Safe and secure online booking with email confirmation',
                color: 'from-orange-500 to-red-500'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">We Serve Major Indian Cities</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur'].map(city => (
              <div key={city} className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:scale-105">
                <span className="font-medium text-gray-700">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8">Join thousands of satisfied customers who trust HomeCrew for their home service needs.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-200 shadow-lg"
            >
              Book Your First Service
            </Link>
            <Link
              to="/login"
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-colors duration-200 border border-white/30"
            >
              Company Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">HomeCrew</h3>
                  <p className="text-sm text-gray-400">Trusted Service Partners</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional home services across India. Connect with skilled professionals for all your home needs.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Carpentry Services</li>
                <li>Plumbing Solutions</li>
                <li>Electrical Work</li>
                <li>Emergency Services</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Our Services</li>
                <li>Contact</li>
                <li>Careers</li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4" />
                  <span>+91-1800-HOMECREW</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4" />
                  <span>help@homecrew.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4" />
                  <span>All Major Indian Cities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 HomeCrew. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;