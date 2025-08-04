import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../Config';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const msg = localStorage.getItem('loginSuccess');
    if (msg) {
      toast.success(msg);
      localStorage.removeItem('loginSuccess');
    }
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
      {/* Hero Section */}
      <div className="max-w-2xl text-center mt-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 dark:text-green-300 mb-4">
          Connect Farmers & Buyers
        </h1>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-6">
          Welcome to Farm-Connect, the e-commerce platform that brings fresh produce directly from local farmers to your table. Empowering farmers, delighting buyers, and making healthy food accessible for all.
        </p>
        <Link to="/shop" className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow transition-all duration-200">
          Shop Fresh Produce
        </Link>
      </div>
      {/* Info Section */}
      <div className="max-w-3xl mt-12 bg-white dark:bg-gray-900 rounded-lg shadow p-6 text-center">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Why Farm-Connect?</h2>
        <ul className="text-gray-700 dark:text-gray-200 text-lg space-y-2">
          <li>🌱 <span className="font-semibold">For Farmers:</span> Reach more buyers, get fair prices, and grow your business.</li>
          <li>🛒 <span className="font-semibold">For Buyers:</span> Access the freshest produce, support local agriculture, and enjoy transparent sourcing.</li>
          <li>🚚 <span className="font-semibold">Direct Delivery:</span> From farm to table, with no middlemen.</li>
        </ul>
      </div>
      {user && (
        <div className="mt-8 text-lg text-gray-700 dark:text-gray-200">
          Logged in as: <span className="font-semibold">{user.displayName || user.email}</span>
        </div>
      )}
    </div>
  );
};

export default Home; 