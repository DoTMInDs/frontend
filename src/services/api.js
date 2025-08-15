import { auth } from '../Config';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://diploma-farmer-connect.onrender.com/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthToken() {
    // Get the current user's ID token from Firebase
    const user = auth.currentUser;
    if (user) {
      return await user.getIdToken();
    }
    return null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Get auth token
    const token = await this.getAuthToken();
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log('Making API request to:', url); // Debug log
      const response = await fetch(url, config);
      
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText); // Debug log
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data); // Debug log
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product API methods
  async getProducts() {
    return this.request('/products/');
  }

  async getMyProducts() {
    return this.request('/products/my_products/');
  }

  async getProduct(id) {
    return this.request(`/products/${id}/`);
  }

  async createProduct(productData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    
    // Add image if it's a base64 string
    if (productData.image && productData.image.startsWith('data:image')) {
      // Convert base64 to blob
      const response = await fetch(productData.image);
      const blob = await response.blob();
      formData.append('image', blob, 'product-image.jpg');
    } else if (productData.image instanceof File) {
      formData.append('image', productData.image);
    }

    return this.request('/products/', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async updateProduct(id, productData) {
    const formData = new FormData();
    
    // Add text fields
    formData.append('name', productData.name);
    formData.append('price', productData.price);
    formData.append('description', productData.description);
    
    // Add image if provided
    if (productData.image && productData.image.startsWith('data:image')) {
      const response = await fetch(productData.image);
      const blob = await response.blob();
      formData.append('image', blob, 'product-image.jpg');
    } else if (productData.image instanceof File) {
      formData.append('image', productData.image);
    }

    return this.request(`/products/${id}/`, {
      method: 'PUT',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async deleteProduct(id) {
    const url = `${this.baseURL}/products/${id}/`;
    
    // Get auth token
    const token = await this.getAuthToken();
    
    const config = {
      method: 'DELETE',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
    };

    try {
      console.log('Making DELETE request to:', url);
      const response = await fetch(url, config);
      
      console.log('Delete response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // DELETE requests typically don't return data, so we just check if it was successful
      return { success: true };
    } catch (error) {
      console.error('Delete request failed:', error);
      throw error;
    }
  }

  // User/Seller API methods
  async getUser(id) {
    return this.request(`/users/${id}/`);
  }

  async getCurrentUser() {
    return this.request('/users/me/');
  }

  async updateUserProfile(userData) {
    return this.request('/users/me/', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async createUserProfile(userData) {
    return this.request('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
}

export default new ApiService(); 