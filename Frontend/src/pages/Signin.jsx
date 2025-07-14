import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const Signin = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when typing
    if (errors[name]) {
      setErrors({...errors, [name]: ''});
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      const { username, token } = response.data;

      // Save to localStorage
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', username);
      localStorage.setItem('token', token);

      // Success animation before redirect
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Signup failed";
      setErrors({...errors, form: errorMsg});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 to-white p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md relative overflow-hidden border border-emerald-50"
      >
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-emerald-50 opacity-70"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-emerald-50 opacity-70"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="text-4xl font-bold text-emerald-700 mb-2"
            >
              Join Our Community
            </motion.h2>
            <p className="text-gray-600">Start your adventure with us today</p>
          </div>

          {errors.form && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded"
            >
              {errors.form}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Username</label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  required
                  className={`w-full px-5 py-3 rounded-xl border-2 ${errors.username ? 'border-red-400' : 'border-gray-200 focus:border-emerald-400'} focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all`}
                />
                {!errors.username && formData.username && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 text-emerald-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </motion.div>
                )}
              </div>
              {errors.username && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.username}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className={`w-full px-5 py-3 rounded-xl border-2 ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-emerald-400'} focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all`}
                />
                {!errors.email && formData.email && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 text-emerald-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </motion.div>
                )}
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className={`w-full px-5 py-3 rounded-xl border-2 ${errors.password ? 'border-red-400' : 'border-gray-200 focus:border-emerald-400'} focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all`}
                />
                {!errors.password && formData.password && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute right-3 top-3 text-emerald-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </motion.div>
                )}
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isSubmitting ? 'bg-emerald-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg'}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Sign Up Now'
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/Login" 
                className="font-medium text-emerald-600 hover:text-emerald-800 hover:underline transition-all"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signin;