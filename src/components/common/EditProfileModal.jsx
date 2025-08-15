import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const EditProfileModal = ({ open, onClose, user, onSave }) => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoURL(user.photoURL || '');
      setPhone(user.phone || '');
      setLocation(user.location || '');
      setBio(user.bio || '');
    }
  }, [user, open]);

  const handleSave = () => {
    onSave({ displayName, photoURL, phone, location, bio });
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-bold text-green-700 dark:text-green-300 mb-4">
                  Edit Profile
                </Dialog.Title>
                <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium mb-1">Display Name</label>
                    <input
                      id="displayName"
                      className="w-full rounded border border-gray-300 p-2"
                      value={displayName}
                      onChange={e => setDisplayName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="photoURL" className="block text-sm font-medium mb-1">Photo URL</label>
                    <input
                      id="photoURL"
                      className="w-full rounded border border-gray-300 p-2"
                      value={photoURL}
                      onChange={e => setPhotoURL(e.target.value)}
                      placeholder="Paste image URL (optional)"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full rounded border border-gray-300 p-2"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                    <input
                      id="location"
                      className="w-full rounded border border-gray-300 p-2"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="Enter your location (city, state)"
                    />
                  </div>
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      id="bio"
                      className="w-full rounded border border-gray-300 p-2"
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder="Tell us about yourself..."
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProfileModal; 