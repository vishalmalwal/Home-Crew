import React, { useState } from 'react';
import { Users, Plus, Trash2, ToggleLeft as Toggle, Star, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp, INDIAN_CITIES } from '../../context/AppContext';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const CompanyDashboard: React.FC = () => {
  const { workers, addWorker, removeWorker, updateWorkerAvailability, bookings, confirmBooking, completeBooking, getPendingBookings, loading } = useApp();
  const [activeTab, setActiveTab] = useState<'pending' | 'bookings' | 'workers' | 'add'>('pending');
  const [submitting, setSubmitting] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: '',
    phone: '',
    photo: '',
    service: '' as 'carpenter' | 'plumber' | 'electrician',
    city: '',
    availability: true
  });

  const pendingBookings = getPendingBookings();

  const handleAddWorker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.phone || !newWorker.service || !newWorker.city) {
      alert('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await addWorker({
        ...newWorker,
        photo: newWorker.photo || ''
      });

      alert('Worker added successfully!');
      setNewWorker({
        name: '',
        phone: '',
        photo: '',
        service: '' as any,
        city: '',
        availability: true
      });
    } catch (error) {
      console.error('Error adding worker:', error);
      alert('Failed to add worker. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveWorker = async (workerId: string) => {
    if (confirm('Are you sure you want to remove this worker?')) {
      setSubmitting(true);
      try {
        await removeWorker(workerId);
        alert('Worker removed successfully!');
      } catch (error) {
        console.error('Error removing worker:', error);
        alert('Failed to remove worker. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const toggleWorkerAvailability = async (workerId: string, currentAvailability: boolean) => {
    setSubmitting(true);
    try {
      await updateWorkerAvailability(workerId, !currentAvailability);
    } catch (error) {
      console.error('Error updating worker availability:', error);
      alert('Failed to update worker availability. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    if (confirm('Confirm this booking?')) {
      setSubmitting(true);
      try {
        await confirmBooking(bookingId);
        alert('Booking confirmed! Customer has been notified.');
      } catch (error) {
        console.error('Error confirming booking:', error);
        alert('Failed to confirm booking. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    if (confirm('Mark this booking as completed?')) {
      setSubmitting(true);
      try {
        await completeBooking(bookingId);
        alert('Booking marked as completed!');
      } catch (error) {
        console.error('Error completing booking:', error);
        alert('Failed to complete booking. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800">Company Admin Panel</h1>
          <p className="text-gray-600 mt-2">Manage workers, bookings, and business operations</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-2 border-b-2 font-medium text-sm relative ${
                activeTab === 'pending'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Bookings
              {pendingBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingBookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Bookings
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'workers'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Manage Workers
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'add'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Add Worker
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'pending' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Pending Booking Requests</h2>
            
            {pendingBookings.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No pending bookings</p>
                <p className="text-gray-500">All booking requests have been processed!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingBookings.map(booking => (
                  <div key={booking.id} className="border border-orange-200 rounded-lg p-6 bg-orange-50">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">{booking.service} - {booking.problem}</h3>
                        <p className="text-gray-600">Customer: {booking.customerName}</p>
                        <p className="text-gray-600">Phone: {booking.customerPhone}</p>
                        <p className="text-gray-600">Assigned Worker: {booking.workerName}</p>
                        <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-orange-600" />
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                          Awaiting Confirmation
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                      <div><strong>Date:</strong> {booking.date}</div>
                      <div><strong>Time:</strong> {booking.timeSlot}</div>
                      <div><strong>City:</strong> {booking.city}</div>
                      <div><strong>Emergency:</strong> {booking.isEmergency ? 'Yes (+₹100)' : 'No'}</div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-700">
                        <strong>Address:</strong> {booking.address}
                      </p>
                      {booking.description && (
                        <p className="text-sm text-gray-700 mt-2">
                          <strong>Description:</strong> {booking.description}
                        </p>
                      )}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleConfirmBooking(booking.id)}
                        disabled={submitting}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Confirm Booking
                      </button>
                      <button
                        onClick={() => completeBooking(booking.id)}
                        disabled={submitting}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reject Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Booking ID</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Customer</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Worker</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Service</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Date & Time</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">City</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">{booking.id.slice(0, 8)}...</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div>
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-sm text-gray-600">{booking.customerPhone}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">{booking.workerName}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div>
                            <div className="font-medium">{booking.service}</div>
                            <div className="text-sm text-gray-600">{booking.problem}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div>
                            <div>{booking.date}</div>
                            <div className="text-sm text-gray-600">{booking.timeSlot}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">{booking.city}</td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(booking.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status === 'pending' ? 'Pending' : 
                               booking.status === 'confirmed' ? 'Confirmed' :
                               booking.status === 'in-progress' ? 'In Progress' :
                               booking.status === 'completed' ? 'Completed' : 
                               booking.status}
                            </span>
                          </div>
                          {booking.isEmergency && (
                            <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              Emergency
                            </span>
                          )}
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="flex space-x-2">
                            {booking.status === 'pending' && (
                              <button
                                onClick={() => handleConfirmBooking(booking.id)}
                                disabled={submitting}
                                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Confirm
                              </button>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleCompleteBooking(booking.id)}
                                disabled={submitting}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Manage Workers</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">ID</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Service</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">City</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Phone</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Rating</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(worker => (
                    <tr key={worker.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-3 font-semibold">{worker.id.slice(0, 8)}...</td>
                      <td className="border border-gray-300 px-4 py-3">{worker.name}</td>
                      <td className="border border-gray-300 px-4 py-3 capitalize">{worker.service}</td>
                      <td className="border border-gray-300 px-4 py-3">{worker.city}</td>
                      <td className="border border-gray-300 px-4 py-3">{worker.phone}</td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{worker.rating.toFixed(1)} ({worker.totalRatings})</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          worker.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {worker.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleWorkerAvailability(worker.id, worker.availability)}
                            disabled={submitting}
                            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Toggle Availability"
                          >
                            <Toggle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveWorker(worker.id)}
                            disabled={submitting}
                            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove Worker"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Add New Worker</h2>
            
            <form onSubmit={handleAddWorker} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Worker Name *</label>
                  <input
                    type="text"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="+91-XXXXXXXXXX"
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Type *</label>
                  <select
                    value={newWorker.service}
                    onChange={(e) => setNewWorker({ ...newWorker, service: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={submitting}
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
                    value={newWorker.city}
                    onChange={(e) => setNewWorker({ ...newWorker, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={submitting}
                  >
                    <option value="">Select City</option>
                    {INDIAN_CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Photo URL (Optional)</label>
                  <input
                    type="url"
                    value={newWorker.photo}
                    onChange={(e) => setNewWorker({ ...newWorker, photo: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/photo.jpg"
                    disabled={submitting}
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty if no photo available</p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newWorker.availability}
                      onChange={(e) => setNewWorker({ ...newWorker, availability: e.target.checked })}
                      className="w-4 h-4"
                      disabled={submitting}
                    />
                    <span className="text-sm">Worker is available for work</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                <span>{submitting ? 'Adding...' : 'Add Worker'}</span>
              </button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDashboard;