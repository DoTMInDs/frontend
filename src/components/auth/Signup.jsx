import React, { useState } from 'react'
import { Button, Label, TextInput, Spinner } from "flowbite-react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../Config';
import { useNavigate } from 'react-router-dom';

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
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-2 w-full bg-white p-8 rounded shadow-md border border-gray-200 !text-gray-900 dark:!text-gray-900">
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <h2 className="flex justify-center items-center text-2xl font-semibold">Sign Up</h2>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name">Username</Label>
          </div>
          <TextInput id="name" name="name" type="text" placeholder="@username" required />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email">Email</Label>
          </div>
          <TextInput id="email" name="email" type="email" placeholder="name@flowbite.com" required />
        </div>
        <div className='relative'>
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <TextInput id="password" name="password" type={passwordVisibility ? 'text' : 'password'} placeholder='*********' required />
          <button type='button' onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute right-2 top-[45px] text-gray-400'>
            {passwordVisibility ? <FaEyeSlash /> : <FaEye /> }
          </button>
        </div>
        <div className='relative'>
          <div className="mb-2 block">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <TextInput id="confirmPassword" name="confirmPassword" type={passwordVisibility ? 'text' : 'password'} placeholder='*********' required />
            <button type='button' onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute right-2 top-[45px] text-gray-400'>
            {passwordVisibility ? <FaEyeSlash /> : <FaEye /> }
            </button>
        </div>
        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" />Signing up...</> : 'Sign Up'}
        </Button>
        <div className="flex justify-center items-center mt-2">
          <p className="text-sm text-gray-500">Already have an account? <a href="/login" className="text-blue-500">Login</a></p>
        </div>
      </form>
    </div>
  )
}

export default Signup