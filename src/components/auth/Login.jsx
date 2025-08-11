import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../Config';
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [error, setError] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false); // New state for Google loading
    const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(false);
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem('loginSuccess', 'Login successful!');
      navigate("/");
    } catch (error) {
      setError('Google sign-in failed');
      console.error(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCred.user);
      setError('');
      localStorage.setItem('loginSuccess', 'Login successful!');
      navigate("/");
    } catch (err) {
      console.log(err);
      setError('Invalid email or password');
    }
    setLoading(false);
    e.target.reset();
  };

  

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] mt-6">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4 w-full bg-white p-8 rounded-lg shadow-lg border border-gray-200">
        {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</p>}
        <h2 className="flex justify-center items-center text-2xl font-semibold text-gray-800">Login</h2>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Your email
          </label>
          <input 
            id="email" 
            type="email" 
            name="email" 
            placeholder="name@example.com" 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Your password
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
        
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="remember" className="text-sm text-gray-700">
            Remember me
          </label>
        </div>
        
        <button
          type="button"
          disabled={googleLoading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          {googleLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600" />
          ) : (
            <>
              <FcGoogle className="text-xl" />
              Sign in with Google
            </>
          )}
        </button>
        
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-sm">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <FcGoogle className="text-xl" /> Sign in with Google
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging in...
            </>
          ) : (
            'Sign in with Google'
          )}
        </button>
        
        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-500">
            Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login