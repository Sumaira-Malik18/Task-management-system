import { useState } from 'react';
import { login, register } from '../services/api';

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = isRegister 
        ? await register(formData) 
        : await login(formData);
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onLogin(res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow w-full max-w-md">
        
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          📋 Task Manager
        </h1>

        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {isRegister ? 'Create Account' : 'Welcome Back!'}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 dark:border-gray-600 rounded p-2 outline-none focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 font-bold ml-1"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;