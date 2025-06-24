import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">About HomeCrew</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to connect skilled professionals with homeowners across India, 
            making quality home services accessible, reliable, and affordable for everyone.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                HomeCrew was founded with a simple vision: to bridge the gap between skilled 
                craftsmen and homeowners who need reliable services. We recognized that finding 
                trustworthy professionals for home repairs and improvements was a common challenge 
                faced by families across India.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Starting as a small local service in Mumbai, we've grown to serve 18+ major cities 
                across India, connecting over 500 verified professionals with thousands of satisfied 
                customers. Our platform ensures quality, reliability, and transparency in every service.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, HomeCrew stands as a trusted name in home services, committed to excellence 
                and customer satisfaction in every interaction.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-orange-100 p-8 rounded-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-700">Skilled Workers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">18+</div>
                  <div className="text-gray-700">Cities</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
                  <div className="text-gray-700">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">4.8★</div>
                  <div className="text-gray-700">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Trust</h3>
              <p className="text-gray-600">
                We verify every professional and ensure transparent, honest service delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality in every service and customer interaction.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Reliability</h3>
              <p className="text-gray-600">
                Punctual, dependable service that you can count on, every single time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Care</h3>
              <p className="text-gray-600">
                We genuinely care about our customers' homes and satisfaction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Mission</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              To revolutionize the home services industry in India by creating a seamless, 
              trustworthy platform that connects skilled professionals with homeowners, 
              ensuring quality service delivery and customer satisfaction at every step.
            </p>
            <div className="bg-gradient-to-r from-blue-600 to-orange-600 text-white p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">Join the HomeCrew Family</h3>
              <p className="text-lg">
                Whether you're a homeowner looking for reliable services or a skilled professional 
                seeking opportunities, HomeCrew is here to serve you with excellence and integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;