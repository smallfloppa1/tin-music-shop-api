import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api/axios';
import { type ProductDto } from '../types';
import { addToCart } from '../store/cartSlice';
import { type AppDispatch, type RootState } from '../store';

const ProductList: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = categorySlug 
        ? `/product/category/${categorySlug}` 
        : '/product'; 
      
      const response = await api.get<ProductDto[]>(endpoint);
      setProducts(response.data);
     
    } catch (err) {
      console.error(err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: ProductDto) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart');
    }
  };

  const handleEditClick = (product: ProductDto) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await api.patch(`/product/${editingProduct.id}`, {
        name: editingProduct.name,
        description: editingProduct.description,
        price: Number(editingProduct.price),
        stock: Number(editingProduct.stock),
        imageUrl: editingProduct.imageUrl,
      });
      
      alert('Product updated successfully');
      setEditingProduct(null);
      fetchProducts(); 
    } catch (err: any) {
      console.error('Failed to update product:', err);
      alert('Failed to update product');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-lg">{error}</p>
        <Link to="/categories" className="text-indigo-600 hover:underline mt-4 inline-block">
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 capitalize">
          {categorySlug ? categorySlug.replace(/-/g, ' ') : 'Products'}
        </h1>
        <Link to="/categories" className="text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Back to Categories
        </Link>
      </div>

      {editingProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Product</h3>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={editingProduct.imageUrl}
                  onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col relative">
              {isAdmin && (
                <button
                  onClick={() => handleEditClick(product)}
                  className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 text-gray-600"
                  title="Edit Product"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}

              <div className="h-48 overflow-hidden bg-gray-100 relative group">
                 {product.imageUrl ? (
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                 )}
              </div>
              <div className="p-4 flex-grow flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2" title={product.name}>
                  {product.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {product.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-xl font-bold text-indigo-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={product.stock <= 0}
                  >
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
