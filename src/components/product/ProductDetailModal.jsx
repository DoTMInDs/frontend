import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import apiService from '../../services/api';

const ProductDetailModal = ({ isOpen, onClose, product }) => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      loadSellerInfo();
    }
  }, [isOpen, product]);

  const loadSellerInfo = async () => {
    if (!product) return;
    
    try {
      setLoading(true);
      
      // Try to get seller information using the API service if seller ID exists
      if (product.seller) {
        try {
          const sellerData = await apiService.getUser(product.seller);
          setSellerInfo(sellerData);
          return;
        } catch (error) {
          console.error('Failed to load seller info from API:', error);
        }
      }
      
      // Fallback to product data or default values
      setSellerInfo({
        name: product.seller_name || product.created_by || product.seller_display_name || 'Unknown Seller',
        email: product.seller_email || product.seller_contact_email || 'No email available',
        phone: product.seller_phone || product.seller_contact_phone || null,
        location: product.seller_location || product.seller_address || product.location || 'Location not specified',
        rating: product.seller_rating || 'No rating yet',
        bio: product.seller_bio || null
      });
    } catch (error) {
      console.error('Failed to load seller info:', error);
      // Set default seller info if everything fails
      setSellerInfo({
        name: 'Unknown Seller',
        email: 'No email available',
        phone: null,
        location: 'Location not specified',
        rating: 'No rating yet',
        bio: null
      });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black bg-opacity-50" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-xl transition-all">
                {/* Header */}
                <div className="bg-green-600 dark:bg-green-700 px-6 py-4">
                  <Dialog.Title className="text-xl font-bold text-white">
                    Product Details
                  </Dialog.Title>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Image */}
                    <div className="space-y-4">
                      <div className="relative">
                        <img
                          src={product.image_url || product.image || 'https://res.cloudinary.com/demo/image/upload/sample.jpg'}
                          alt={product.name}
                          className="w-full h-64 object-cover rounded-lg shadow-md"
                          onError={(e) => {
                            e.target.src = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
                          }}
                        />
                        {product.discount && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium">
                            {product.discount}% OFF
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Information */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-3">
                                                     <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                             ₵{parseFloat(product.price).toFixed(2)}
                           </p>
                           {product.original_price && product.original_price > product.price && (
                             <p className="text-lg text-gray-500 line-through">
                               ₵{parseFloat(product.original_price).toFixed(2)}
                             </p>
                           )}
                        </div>
                                                 {product.discount && (
                           <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                             Save ₵{((product.original_price - product.price) || 0).toFixed(2)}!
                           </p>
                         )}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Description
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300">
                          {product.description}
                        </p>
                      </div>

                      {/* Additional Product Details */}
                      <div className="grid grid-cols-2 gap-4">
                        {product.category && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Category
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {product.category}
                            </p>
                          </div>
                        )}
                        {product.stock && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Stock Available
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {product.stock} units
                            </p>
                          </div>
                        )}
                        {product.created_at && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Listed On
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {new Date(product.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {product.location && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                              Product Location
                            </h4>
                            <p className="text-gray-900 dark:text-white">
                              {product.location}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Seller Information */}
                      <div className="border-t pt-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          Seller Information
                        </h4>
                        
                        {loading ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                            <span className="text-gray-500">Loading seller info...</span>
                          </div>
                        ) : sellerInfo ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  {sellerInfo.name || 'Unknown Seller'}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {sellerInfo.email || 'No email available'}
                                </p>
                              </div>
                            </div>
                            
                                                         {sellerInfo.phone && (
                               <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                   <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                 </svg>
                                 <span className="text-sm">{sellerInfo.phone}</span>
                               </div>
                             )}
                             {sellerInfo.location && (
                               <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                   <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                 </svg>
                                 <span className="text-sm">{sellerInfo.location}</span>
                               </div>
                             )}
                             {sellerInfo.bio && (
                               <div className="mt-2">
                                 <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                   {sellerInfo.bio}
                                 </p>
                               </div>
                             )}
                            
                            {sellerInfo.rating && (
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= (sellerInfo.rating || 0)
                                          ? 'text-yellow-400'
                                          : 'text-gray-300 dark:text-gray-600'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {sellerInfo.rating} out of 5
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400 text-sm">
                            Seller information not available
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex justify-end space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      if (sellerInfo && sellerInfo.email) {
                        window.open(`mailto:${sellerInfo.email}?subject=Inquiry about ${product.name}`, '_blank');
                      } else if (sellerInfo && sellerInfo.phone) {
                        window.open(`tel:${sellerInfo.phone}`, '_blank');
                      } else {
                        alert('Seller contact information not available');
                      }
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    {sellerInfo?.phone ? 'Call Seller' : 'Email Seller'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ProductDetailModal;
