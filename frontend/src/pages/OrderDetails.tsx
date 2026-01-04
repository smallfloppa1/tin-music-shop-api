import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { type OrderDto } from '../types';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const response = await api.get<OrderDto>(`/order/${id}`);
        setOrder(response.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    void fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center text-red-600 p-8">
        <p className="text-lg">{error || 'Order not found'}</p>
        <Link to="/orders" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
        <Link to="/orders" className="text-indigo-600 hover:text-indigo-800 font-medium">
          &larr; Back to Orders
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order Information</h3>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Date Placed</dt>
              <dd className="mt-1 text-sm text-gray-900">{new Date(order.createdAt).toLocaleString()}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${order.status === 'COMPLETED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' : 
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}`}>
                  {order.status}
                </span>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Total Amount</dt>
              <dd className="mt-1 text-sm font-bold text-indigo-600">${Number(order.totalAmount).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Order Items</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {order.items.map((item) => (
            <li key={item.id} className="p-4 sm:p-6 flex items-center">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      <Link to={`/products/${item.product.id}`} className="hover:text-indigo-600">
                        {item.product.name}
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm text-gray-500">{item.product.categoryName}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${Number(item.priceAtPurchase).toFixed(2)}
                  </p>
                </div>
                <div className="mt-2 flex justify-between">
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetails;
