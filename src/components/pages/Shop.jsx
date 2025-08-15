import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import apiService from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import ProductDetailModal from '../product/ProductDetailModal';

const Shop = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', image: '', description: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetailModalOpen, setProductDetailModalOpen] = useState(false);

  // Load products from API on mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProducts();
      console.log('Shop API Response:', data);
      
      // Handle both paginated and non-paginated responses
      const products = data.results || data;
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
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setProductDetailModalOpen(true);
  };

  const handleCloseProductDetailModal = () => {
    setProductDetailModalOpen(false);
    setSelectedProduct(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const newProduct = await apiService.createProduct({
        name: form.name,
        price: form.price,
        description: form.description,
        image: form.image,
        seller: user.uid,
        seller_name: user.displayName || user.email,
        seller_email: user.email,
        seller_phone: user.phone || null,
        seller_location: user.location || null,
        seller_bio: user.bio || null,
      });
      
      setProducts(prev => [newProduct, ...prev]);
      handleCloseModal();
    } catch (err) {
      setError('Failed to add product');
      console.error('Error adding product:', err);
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
    <div className="min-h-[80vh] bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="flex justify-between items-center max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">Shop Fresh Produce</h1>
        {user && (
          <button 
            onClick={handleOpenModal} 
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Add Product
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded max-w-6xl mx-auto">
          {error}
        </div>
      )}

      {/* Modal for adding product - only show for authenticated users */}
      {user && (
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
                        <label htmlFor="price" className="block text-sm font-medium mb-1">Price (₵)</label>
                        <input
                          id="price"
                          name="price"
                          type="number"
                          step="0.01"
                          className="w-full rounded border border-gray-300 p-2"
                          value={form.price}
                          onChange={handleChange}
                          required
                          placeholder="e.g. 3.99"
                        />
                      </div>
                      <div>
                        <label htmlFor="image" className="block text-sm font-medium mb-1">Image URL</label>
                        <input
                          id="image"
                          name="image"
                          className="w-full rounded border border-gray-300 p-2"
                          value={form.image}
                          onChange={handleChange}
                          required
                          placeholder="Paste image URL"
                        />
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
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {products.map(product => (
          <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
            <img 
              src={product.image_url || product.image || 'https://res.cloudinary.com/demo/image/upload/sample.jpg'} 
              alt={product.name} 
              className="w-full h-40 object-cover"
              onError={(e) => {
                e.target.src = 'https://res.cloudinary.com/demo/image/upload/sample.jpg';
              }}
            />
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">{product.name}</h2>
              <p className="text-lg text-gray-700 dark:text-gray-200 mb-2">₵{parseFloat(product.price).toFixed(2)}</p>
              <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">{product.description}</p>
              <button 
                onClick={() => handleViewProduct(product)}
                className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded hover:bg-green-700 transition-colors"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-8">
          <p>No products available in the shop yet.</p>
        </div>
      )}

      {/* Product Detail Modal */}
      <ProductDetailModal
        isOpen={productDetailModalOpen}
        onClose={handleCloseProductDetailModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default Shop; 