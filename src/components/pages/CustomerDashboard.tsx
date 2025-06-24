import React, { useState } from 'react';
import { Calendar, Star, Clock, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp, INDIAN_CITIES, PROBLEMS } from '../../context/AppContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const CustomerDashboard: React.FC = () => {
  const { currentUser, createBooking, getUserBookings, getWorkersByCity, rateWorker, workers } = useApp();
  const [activeTab, setActiveTab] = useState<'book' | 'history' | 'rate'>('book');
  const [bookingForm, setBookingForm] = useState({
    service: '',
    problem: '',
    description: '',
    city: '',
    date: '',
    timeSlot: '',
    address: '',
    customerName: currentUser?.name || '',
    customerPhone: '',
    customerEmail: currentUser?.email || '',
    isEmergency: false,
    preferredWorker: ''
  });
  const [ratingForm, setRatingForm] = useState({
    bookingId: '',
    rating: 5,
    review: ''
  });

  const userBookings = currentUser ? getUserBookings(currentUser.id) : [];
  const availableWorkers = bookingForm.city ? getWorkersByCity(bookingForm.city, bookingForm.service || undefined) : [];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let assignedWorker;
    if (bookingForm.preferredWorker) {
      assignedWorker = workers.find(w => w.id === bookingForm.preferredWorker);
    } else {
      const availableOnes = getWorkersByCity(bookingForm.city, bookingForm.service);
      assignedWorker = availableOnes[0];
    }

    if (!assignedWorker) {
      alert('No workers available for this service in your city!');
      return;
    }

    const bookingId = createBooking({
      customerId: currentUser!.id,
      customerName: bookingForm.customerName,
      customerPhone: bookingForm.customerPhone,
      customerEmail: bookingForm.customerEmail,
      workerId: assignedWorker.id,
      workerName: assignedWorker.name,
      service: bookingForm.service,
      problem: bookingForm.problem,
      description: bookingForm.description,
      date: bookingForm.date,
      timeSlot: bookingForm.timeSlot,
      address: bookingForm.address,
      city: bookingForm.city,
      isEmergency: bookingForm.isEmergency
    });

    alert(`Booking request submitted! Booking ID: ${bookingId}. Please wait for company confirmation.`);
    
    // Reset form
    setBookingForm({
      service: '',
      problem: '',
      description: '',
      city: '',
      date: '',
      timeSlot: '',
      address: '',
      customerName: currentUser?.name || '',
      customerPhone: '',
      customerEmail: currentUser?.email || '',
      isEmergency: false,
      preferredWorker: ''
    });
  };

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateWorker(ratingForm.bookingId, ratingForm.rating, ratingForm.review);
    alert('Rating submitted successfully!');
    setRatingForm({ bookingId: '', rating: 5, review: '' });
  };

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {currentUser?.name}!</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('book')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'book'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Book Service
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Booking History
            </button>
            <button
              onClick={() => setActiveTab('rate')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'rate'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Rate Worker
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'book' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
            
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Service Type *</label>
                  <select
                    value={bookingForm.service}
                    onChange={(e) => setBookingForm({ ...bookingForm, service: e.target.value, problem: '' })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Service</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="plumber">Plumber</option>
                    <option value="electrician">Electrician</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <select
                    value={bookingForm.city}
                    onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select City</option>
                    {INDIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {bookingForm.service && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Problem Type *</label>
                    <select
                      value={bookingForm.problem}
                      onChange={(e) => setBookingForm({ ...bookingForm, problem: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Problem</option>
                      {PROBLEMS[bookingForm.service as keyof typeof PROBLEMS]?.map(problem => (
                        <option key={problem} value={problem}>{problem}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Date *</label>
                  <input
                    type="date"
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Time Slot *</label>
                  <select
                    value={bookingForm.timeSlot}
                    onChange={(e) => setBookingForm({ ...bookingForm, timeSlot: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={bookingForm.customerPhone}
                    onChange={(e) => setBookingForm({ ...bookingForm, customerPhone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Address *</label>
                <textarea
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter your complete address including landmarks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Problem Description</label>
                <textarea
                  value={bookingForm.description}
                  onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe your problem in detail so the worker can bring appropriate tools"
                />
              </div>

              {availableWorkers.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Preferred Worker (Optional)</label>
                  <select
                    value={bookingForm.preferredWorker}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredWorker: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Auto-assign best available worker</option>
                    {availableWorkers.map(worker => (
                      <option key={worker.id} value={worker.id}>
                        {worker.name} - ⭐ {worker.rating} ({worker.totalRatings} reviews)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emergency"
                  checked={bookingForm.isEmergency}
                  onChange={(e) => setBookingForm({ ...bookingForm, isEmergency: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="emergency" className="text-sm">
                  Emergency Service (+₹100 extra charge)
                </label>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Booking Request
              </button>
            </form>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Booking History</h2>
            
            {userBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No bookings found.</p>
                <p className="text-gray-500">Book your first service to see it here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {userBookings.map(booking => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{booking.service} - {booking.problem}</h3>
                        <p className="text-gray-600">Worker: {booking.workerName}</p>
                        <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status === 'pending' ? 'Awaiting Confirmation' : 
                           booking.status === 'confirmed' ? 'Confirmed' :
                           booking.status === 'in-progress' ? 'In Progress' :
                           booking.status === 'completed' ? 'Completed' : 
                           booking.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{booking.date} at {booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.city}</span>
                      </div>
                      {booking.isEmergency && (
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-orange-600" />
                          <span className="text-orange-600">Emergency Service</span>
                        </div>
                      )}
                      {booking.rating && (
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>Rated: {booking.rating}/5</span>
                        </div>
                      )}
                    </div>
                    
                    {booking.description && (
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Description:</strong> {booking.description}
                      </p>
                    )}
                    
                    {booking.review && (
                      <p className="text-sm text-gray-700">
                        <strong>Your Review:</strong> {booking.review}
                      </p>
                    )}

                    {booking.status === 'confirmed' && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          ✅ Your booking has been confirmed! The worker will arrive at your location on the scheduled time.
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rate' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Rate Worker</h2>
            
            <form onSubmit={handleRatingSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Completed Booking</label>
                <select
                  value={ratingForm.bookingId}
                  onChange={(e) => setRatingForm({ ...ratingForm, bookingId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a booking to rate</option>
                  {userBookings.filter(b => b.status === 'completed' && !b.rating).map(booking => (
                    <option key={booking.id} value={booking.id}>
                      {booking.service} - {booking.workerName} ({booking.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rating (1-5 stars)</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingForm({ ...ratingForm, rating: star })}
                      className={`text-3xl transition-colors ${
                        star <= ratingForm.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Review</label>
                <textarea
                  value={ratingForm.review}
                  onChange={(e) => setRatingForm({ ...ratingForm, review: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Share your experience with the worker's service..."
                />
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Rating
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;