import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../Config';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [error, setError] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(false);
        setLoading(true);
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        // Email validation
        if (!email || !email.includes('@') || !/^\S+@\S+\.\S+$/.test(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            setLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            localStorage.setItem('loginSuccess', 'Account created! Welcome!');
            navigate('/'); // Redirect to home after successful signup
        } catch (err) {
            console.log(err);
            setError('Failed to Create account!!!');
        }
        setLoading(false);
        e.target.reset();
    }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] mt-6">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        <h2 className="flex justify-center items-center text-2xl font-semibold text-gray-800">Sign Up</h2>
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input 
            id="name" 
            name="name" 
            type="text" 
            placeholder="@username" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input 
            id="password" 
            name="password" 
            type={passwordVisibility ? 'text' : 'password'} 
            placeholder="*********" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          />
          <button 
            type="button" 
            onClick={() => setPasswordVisibility(!passwordVisibility)} 
            className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
          >
            {passwordVisibility ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <div className="relative">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input 
            id="confirmPassword" 
            name="confirmPassword" 
            type={passwordVisibility ? 'text' : 'password'} 
            placeholder="*********" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
          />
          <button 
            type="button" 
            onClick={() => setPasswordVisibility(!passwordVisibility)} 
            className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
          >
            {passwordVisibility ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing up...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
        
        <div className="flex justify-center items-center mt-2">
          <p className="text-sm text-gray-500">
            Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Signup