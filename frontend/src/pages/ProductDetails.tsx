import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../api/axios';
import { type ProductDto } from '../types';
import { addToCart } from '../store/cartSlice';
import { type AppDispatch, type RootState } from '../store';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await api.get<ProductDto>(`/product/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    void fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      alert('Added to cart!');
    } catch (err) {
      console.error('Failed to add to cart:', err);
      alert('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-lg">{error || 'Product not found'}</p>
        <Link to="/categories" className="text-indigo-600 hover:underline mt-4 inline-block">
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/categories" className="text-indigo-600 hover:text-indigo-800 font-medium mb-8 inline-block">
        &larr; Back to Categories
      </Link>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="md:flex">
          <div className="md:w-1/2 bg-gray-100 relative h-96 md:h-auto">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-8 flex flex-col">
            <div className="mb-4">
              <span className="text-sm text-indigo-600 font-semibold tracking-wide uppercase">
                {product.categoryName}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>

            <div className="mb-6">
              <p className="text-3xl text-gray-900 font-bold">${Number(product.price).toFixed(2)}</p>
              <p className={`mt-2 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </p>
            </div>

            <div className="prose prose-sm text-gray-500 mb-8 flex-grow">
              <p>{product.description}</p>
            </div>

            <div className="mt-auto border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-24">
                  <label htmlFor="quantity" className="sr-only">Quantity</label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    disabled={product.stock <= 0}
                  >
                    {[...Array(Math.min(10, product.stock)).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || addingToCart}
                  className="flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {addingToCart ? 'Adding...' : (product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
