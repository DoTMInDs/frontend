import React, { useState } from 'react'
import { Button, Checkbox, Label, TextInput, Spinner } from "flowbite-react";
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../Config';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [error, setError] = useState(false);
    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem('loginSuccess', 'Login successful!');
      navigate("/");
    } catch (error) {
      setError('Google sign-in failed');
      console.error(error);
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
      // Handle error (show error message)
      console.log(err);
      setError('Invalid email or password');
    }
    setLoading(false);
    e.target.reset();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] mt-6">
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-2 w-full bg-white p-8 rounded shadow-md border border-gray-200 !text-gray-900 dark:!text-gray-900">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <h2 className="flex justify-center items-center text-2xl font-semibold">Login</h2>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email1">Your email</Label>
          </div>
          <TextInput id="email1" type="email" name='email' placeholder="name@flowbite.com" required />
        </div>
        <div className='relative'>
          <div className="mb-2 block">
            <Label htmlFor="password1">Your password</Label>
          </div>
          <TextInput id="password1" name='password' type={passwordVisibility ? 'text' : 'password'} placeholder='*********' required />
            <button type='button' onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute right-2 top-[45px] text-gray-400'>
                {passwordVisibility ? <FaEyeSlash /> : <FaEye /> }
            </button>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" />
          <Label htmlFor="remember">Remember me</Label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" />Logging in...</> : 'Submit'}
        </Button>
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <Button
          type="button"
          color="light"
          className="w-full flex items-center justify-center gap-2 border border-gray-300"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="text-xl" /> Sign in with Google
        </Button>
        <div className="flex justify-center items-center">
            <p className="text-sm text-gray-500">Don't have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
        </div>
      </form>
    </div>
  )
}

export default Login