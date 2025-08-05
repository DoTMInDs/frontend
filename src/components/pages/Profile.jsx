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
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async ({ displayName, photoURL }) => {
    if (!user) return;
    try {
      await updateProfile(user, { displayName, photoURL });
      setUser({ ...user, displayName, photoURL });
      toast.success('Profile updated!');
    } catch (err) {
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
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400">More profile features coming soon...</p>
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