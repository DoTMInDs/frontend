import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Product = () => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load products from API on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      console.log('API Response:', data); // Debug log
      
      // Handle both paginated and non-paginated responses
      const products = data.results || data;
      console.log('Products array:', products); // Debug log
      
      // Log image URLs for debugging
      products.forEach(product => {
        console.log(`Product ${product.name}:`, {
          image: product.image,
          image_url: product.image_url
        });
      });
      
      setProducts(Array.isArray(products) ? products : []);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setForm({ name: '', price: '', image: '', description: '' });
    setImagePreview('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const newProduct = await apiService.createProduct({
        name: form.name,
        price: form.price,
        description: form.description,
        image: imagePreview,
      });
      
      setProducts(prev => [newProduct, ...prev]);
      handleCloseModal();
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await apiService.deleteProduct(productId);
      setProducts(prev => prev.filter(product => product.id !== productId));
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">My Products</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back, {user?.displayName || user?.email}! Manage your products here.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <button 
        onClick={handleOpenModal} 
        className="mb-8 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
      >
        Add Product
      </button>
      
      {/* Modal for adding product */}
      <Transition appear show={openModal} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
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
                    Add New Product
                  </Dialog.Title>
                  <form className="flex flex-col gap-4" onSubmit={handleAddProduct}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-1">Product Name</label>
                      <input
                        id="name"
                        name="name"
                        className="w-full rounded border border-gray-300 p-2"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Fresh Tomatoes"
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium mb-1">Price ($)</label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        className="w-full rounded border border-gray-300 p-2"
                        value={form.price}
                        onChange={handleChange}
                        required
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label htmlFor="image" className="block text-sm font-medium mb-1">Product Image</label>
                      <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded" />
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                              />
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                          </div>
                        )}
                        <input 
                          id="dropzone-file" 
                          name="image" 
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        className="w-full rounded border border-gray-300 p-2"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Describe your product..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
                      >
                        Add Product
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      
      {/* Product Grid */}
      {products.length > 0 && (
        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={product.image_url || product.image || 'https://via.placeholder.com/400x200?text=Product+Image'}
                  alt={product.name}
                  onError={(e) => {
                    console.log('Image failed to load:', product.image_url || product.image);
                    e.target.src = 'https://via.placeholder.com/400x200?text=Product+Image';
                  }}
                />
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
              <div className="p-4">
                <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {product.name}
                </h5>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-300">
                    ${product.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {products.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          <p>You haven't added any products yet. Add your first product!</p>
        </div>
      )}
    </div>
  );
};

export default Product;