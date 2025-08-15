import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { auth } from '../../Config';
import { FiEdit3 } from "react-icons/fi";
import EditProfileModal from '../common/EditProfileModal';
import { toast } from 'react-toastify';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Load saved profile data from localStorage
        const savedProfile = localStorage.getItem(`userProfile_${currentUser.uid}`);
        if (savedProfile) {
          try {
            const profileData = JSON.parse(savedProfile);
            setUser({
              ...currentUser,
              ...profileData
            });
          } catch (error) {
            console.error('Error parsing saved profile:', error);
            setUser(currentUser);
          }
        } else {
          setUser(currentUser);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async ({ displayName, photoURL, phone, location, bio }) => {
    if (!user) return;
    try {
      // Update Firebase profile
      await updateProfile(user, { displayName, photoURL });
      
      // Update local user state with new information
      const updatedUser = { 
        ...user, 
        displayName, 
        photoURL,
        phone,
        location,
        bio
      };
      setUser(updatedUser);
      
      // Save to localStorage for persistence
      localStorage.setItem(`userProfile_${user.uid}`, JSON.stringify({
        phone,
        location,
        bio
      }));
      
      toast.success('Profile updated!');
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error('Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="max-w-md w-full text-center p-8">
          <h2 className="text-2xl font-bold mb-2">Profile</h2>
          <p className="text-gray-500">You are not logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full text-center p-8 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Profile</h2>
          <FiEdit3
            className='w-[35px] h-[35px] p-2 rounded-md text-white cursor-pointer bg-blue-600'
            onClick={() => setOpenModal(true)}
          />
        </div>
        <div className="flex flex-col items-center mb-4">
          <img
            src={user.photoURL || undefined}
            alt="User avatar"
            className="w-24 h-24 rounded-full object-cover ring-2 ring-green-500 mb-2"
          />
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-1">{user.displayName || 'No Name'}</h2>
          <p className="text-gray-700 dark:text-gray-200">{user.email}</p>
        </div>
        <div className="mt-6 space-y-4">
          {/* Seller Contact Information */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">Contact Information</h3>
            <div className="space-y-2">
              {user.phone && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-200">{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-200">{user.location}</span>
                </div>
              )}
              {user.bio && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{user.bio}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Seller Status */}
          <div className="text-left">
            <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">Seller Status</h3>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Active Seller
            </div>
          </div>
        </div>
      </div>
      <EditProfileModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={user}
        onSave={handleSave}
      />
    </div>
  );
};

export default Profile;