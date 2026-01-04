import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Music Shop</h1>
      <p className="text-xl text-gray-600 mb-8">
        Find the best musical instruments and accessories here.
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          to="/categories"
          className="bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    </div>
  );
};

export default Home;
