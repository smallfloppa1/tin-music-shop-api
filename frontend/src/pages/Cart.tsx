import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { type AppDispatch, type RootState } from '../store';
import { fetchCart, removeFromCart, clearCart } from '../store/cartSlice';
import { api } from '../api/axios';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { cart, loading, error } = useSelector((state: RootState) => state.cart);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemoveItem = (itemId: number) => {
    if (confirm('Are you sure you want to remove this item?')) {
      dispatch(removeFromCart(itemId));
    }
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handlePlaceOrder = async () => {
    if (!cart || cart.items.length === 0) return;
    
    setPlacingOrder(true);
    try {
      await api.post('/order');
      dispatch(clearCart()); 
      alert('Order placed successfully!');
      navigate('/profile');
    } catch (err: any) {
      console.error('Failed to place order:', err);
      alert('Failed to place order. ' + (err.response?.data?.message || ''));
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading && !cart) {
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
        <button 
          onClick={() => dispatch(fetchCart())}
          className="mt-4 text-indigo-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/categories"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {cart.items.map((item) => (
                <li key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-1 flex flex-col sm:flex-row sm:justify-between w-full mt-4 sm:mt-0">
                    <div className="flex flex-col">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link to={`/products/${item.product.id}`} className="hover:text-indigo-600">
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">{item.product.categoryName}</p>
                        <p className="mt-1 text-sm font-medium text-indigo-600">
                            ${Number(item.product.price).toFixed(2)}
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end mt-4 sm:mt-0">
                        <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">Qty: {item.quantity}</span>
                        </div>
                        
                        <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="font-medium text-red-600 hover:text-red-500 sm:mt-2"
                        >
                            Remove
                        </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                <button 
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                    Clear Cart
                </button>
            </div>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="flow-root">
              <dl className="-my-4 divide-y divide-gray-200">
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Subtotal</dt>
                  <dd className="font-medium text-gray-900">${Number(cart.totalAmount).toFixed(2)}</dd>
                </div>
                <div className="py-4 flex items-center justify-between">
                  <dt className="text-gray-600">Shipping</dt>
                  <dd className="font-medium text-gray-900">Free</dd>
                </div>
                <div className="py-4 flex items-center justify-between border-t border-gray-200">
                  <dt className="text-base font-bold text-gray-900">Order Total</dt>
                  <dd className="text-base font-bold text-indigo-600">${Number(cart.totalAmount).toFixed(2)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                or{' '}
                <Link to="/categories" className="text-indigo-600 font-medium hover:text-indigo-500">
                  Continue Shopping<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
