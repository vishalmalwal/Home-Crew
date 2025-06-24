import React, { useState } from 'react';
import { LogOut, Building, Users, Plus, Trash2, ToggleLeft as Toggle, Star } from 'lucide-react';
import { useApp, Worker, INDIAN_CITIES } from '../context/AppContext';

const CompanyDashboard: React.FC = () => {
  const { currentUser, logout, workers, addWorker, removeWorker, updateWorkerAvailability, bookings } = useApp();
  const [activeTab, setActiveTab] = useState<'workers' | 'bookings' | 'add'>('workers');
  const [newWorker, setNewWorker] = useState({
    name: '',
    phone: '',
    photo: '',
    service: '' as 'carpenter' | 'plumber' | 'electrician',
    city: '',
    availability: true
  });

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorker.name || !newWorker.phone || !newWorker.service || !newWorker.city) {
      alert('Please fill all required fields');
      return;
    }

    addWorker({
      ...newWorker,
      photo: newWorker.photo || 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150'
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
  };

  const handleRemoveWorker = (workerId: string) => {
    if (confirm('Are you sure you want to remove this worker?')) {
      removeWorker(workerId);
    }
  };

  const toggleWorkerAvailability = (workerId: string, currentAvailability: boolean) => {
    updateWorkerAvailability(workerId, !currentAvailability);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Building className="w-8 h-8 text-orange-600" />
            <div>
              <h1 className="text-xl font-bold text-orange-600">HomeCrew Admin</h1>
              <p className="text-sm text-gray-600">Company Management Portal</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
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
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              View Bookings
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'workers' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Manage Workers</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Photo</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">City</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Rating</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(worker => (
                    <tr key={worker.id}>
                      <td className="border border-gray-300 px-4 py-2 font-semibold">{worker.id}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <img
                          src={worker.photo}
                          alt={worker.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{worker.name}</td>
                      <td className="border border-gray-300 px-4 py-2 capitalize">{worker.service}</td>
                      <td className="border border-gray-300 px-4 py-2">{worker.city}</td>
                      <td className="border border-gray-300 px-4 py-2">{worker.phone}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{worker.rating.toFixed(1)} ({worker.totalRatings})</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          worker.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {worker.availability ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toggleWorkerAvailability(worker.id, worker.availability)}
                            className="bg-blue-600 text-white p-1 rounded hover:bg-blue-700"
                            title="Toggle Availability"
                          >
                            <Toggle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveWorker(worker.id)}
                            className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
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

        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            
            {bookings.length === 0 ? (
              <p className="text-gray-600">No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Booking ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Customer</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Worker</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Service</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">City</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Emergency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">{booking.id}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            {booking.customerName}
                            <div className="text-sm text-gray-600">{booking.customerPhone}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{booking.workerName}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            {booking.service}
                            <div className="text-sm text-gray-600">{booking.problem}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <div>
                            {booking.date}
                            <div className="text-sm text-gray-600">{booking.timeSlot}</div>
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{booking.city}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.isEmergency && (
                            <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              Emergency
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Add New Worker</h2>
            
            <form onSubmit={handleAddWorker} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Worker Name *</label>
                  <input
                    type="text"
                    value={newWorker.name}
                    onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={newWorker.phone}
                    onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="+91-XXXXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Type *</label>
                  <select
                    value={newWorker.service}
                    onChange={(e) => setNewWorker({ ...newWorker, service: e.target.value as any })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
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
                    value={newWorker.city}
                    onChange={(e) => setNewWorker({ ...newWorker, city: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
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
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <p className="text-sm text-gray-500 mt-1">Leave empty to use default photo</p>
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newWorker.availability}
                      onChange={(e) => setNewWorker({ ...newWorker, availability: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Worker is available for work</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Worker</span>
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyDashboard;