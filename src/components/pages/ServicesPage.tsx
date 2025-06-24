import React from 'react';
import { Building, Users, MapPin, CheckCircle, Clock, Star } from 'lucide-react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import { PROBLEMS } from '../../context/AppContext';

const ServicesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional home services delivered by skilled craftsmen across India. 
            Quality work, fair pricing, and complete satisfaction guaranteed.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Carpentry */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl shadow-lg border border-blue-200">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Building className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Carpentry Services</h3>
              <p className="text-gray-600 mb-6">
                Expert woodworking solutions for all your furniture and structural needs.
              </p>
              <ul className="space-y-3">
                {PROBLEMS.carpenter.map((service, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-blue-600 text-white rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Starting from</span>
                  <span className="text-xl font-bold">₹299</span>
                </div>
              </div>
            </div>

            {/* Plumbing */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl shadow-lg border border-orange-200">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Plumbing Services</h3>
              <p className="text-gray-600 mb-6">
                Complete plumbing solutions from repairs to new installations.
              </p>
              <ul className="space-y-3">
                {PROBLEMS.plumber.map((service, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-orange-600 text-white rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Starting from</span>
                  <span className="text-xl font-bold">₹199</span>
                </div>
              </div>
            </div>

            {/* Electrical */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl shadow-lg border border-green-200">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Electrical Services</h3>
              <p className="text-gray-600 mb-6">
                Safe and reliable electrical work by certified professionals.
              </p>
              <ul className="space-y-3">
                {PROBLEMS.electrician.map((service, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{service}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-green-600 text-white rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Starting from</span>
                  <span className="text-xl font-bold">₹249</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Our Services?</h2>
            <p className="text-xl text-gray-600">Quality and reliability you can trust</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Same Day Service</h3>
              <p className="text-gray-600">
                Book today and get service the same day. Emergency services available 24/7.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
              <p className="text-gray-600">
                All work comes with our quality guarantee. Not satisfied? We'll make it right.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Professionals</h3>
              <p className="text-gray-600">
                All our professionals are background verified and highly rated by customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Transparent Pricing</h2>
            <p className="text-xl text-gray-600">No hidden charges, fair pricing for quality work</p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Service Charges</h3>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span>Regular Service</span>
                    <span className="font-semibold">₹199 - ₹999</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Emergency Service</span>
                    <span className="font-semibold">+₹100 extra</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Material Costs</span>
                    <span className="font-semibold">As per actual</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="bg-white text-gray-800 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold mb-2">Free Estimates</h4>
                  <p className="text-sm">
                    Get a detailed quote before work begins. No surprises, no hidden costs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;