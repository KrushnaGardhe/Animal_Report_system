import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signUpNGO } from '../lib/supabase';
import { UserPlus, Building2, Phone, FileText, MapPin, FileEdit } from 'lucide-react';

export default function NGORegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    organization: '',
    phone: '',
    registrationNumber: '',
    address: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      await signUpNGO(formData);
      alert('Registration successful! Please check your email for verification.');
      navigate('/ngo/login');
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <UserPlus className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">NGO Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our network of animal rescue organizations
          </p>
        </motion.div>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border-l-4 border-red-500"
          >
            {error}
          </motion.div>
        )}
        
        <motion.form
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-8 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Building2 className="w-4 h-4 mr-2" />
                Organization Name *
              </label>
              <input
                type="text"
                name="organization"
                required
                value={formData.organization}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 mr-2" />
                Registration Number *
              </label>
              <input
                type="text"
                name="registrationNumber"
                required
                value={formData.registrationNumber}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="NGO Registration Number"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <UserPlus className="w-4 h-4 mr-2" />
                Contact Person Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Phone className="w-4 h-4 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 mr-2" />
              Address *
            </label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Complete address of the NGO"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileEdit className="w-4 h-4 mr-2" />
              Organization Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Brief description of your organization and its activities"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="ngo@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all disabled:bg-gray-400"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : (
              'Register NGO'
            )}
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
}
