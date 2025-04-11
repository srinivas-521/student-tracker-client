import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: undefined
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isFirstTimeUser', 'true');
      navigate('/home');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'An error occurred during signup' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl border border-border">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an Account</h1>
          <p className="text-muted-foreground">Enter your details to get started</p>
        </div>

        {errors.general && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
            {errors.general}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.name ? 'border-destructive' : 'border-border'
              }`}
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.email ? 'border-destructive' : 'border-border'
              }`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
                errors.password ? 'border-destructive' : 'border-border'
              }`}
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm text-primary hover:text-primary/80">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup; 