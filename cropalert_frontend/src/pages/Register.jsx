// src/pages/Register.jsx

import { useState } from 'react';
import { registerUser } from '../api/auth';
import { Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'farmer',
  });

//   const [error, setError]       = useState(null);
//   const [success, setSuccess]   = useState(false);


  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(formData);
      console.log('Success:', result);
      alert('Registration successful!');
    //   // Handle success, e.g., show a success message or redirect

    //   setSuccess(true);
    //   setError(null);
    } catch (err) {
      console.error('Error:', err);
    //   setError(err);
    //   setSuccess(false);
    }
    console.log(formData);
    // send formData to your backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <select
          name="role"
          className="w-full border border-gray-300 rounded px-3 py-2"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="farmer">Farmer</option>
          <option value="argonome">Agronome</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign-up
        </button>
        <Link to="/login" className="text-blue-500 hover:underline text-center block">
                    Already have an account? Sign-in here
        </Link>
      </form>
    </div>
  );
}
