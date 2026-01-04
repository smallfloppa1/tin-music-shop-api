import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/axios';
import { type ProductCategoryDto } from '../types';

const Categories: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ProductCategoryDto[]>([]);
  const [currentCategory, setCurrentCategory] = useState<ProductCategoryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await api.get<ProductCategoryDto[]>('/product-category');
        const allCategories = response.data;

        if (slug) {
          const current = allCategories.find(c => c.slug === slug);
          setCurrentCategory(current || null);

          if (current) {
            const children = allCategories.filter(c => c.parentId === current.id);
            
            if (children.length === 0) {
              navigate(`/products/category/${current.slug}`, { replace: true });
              return;
            }
            
            setCategories(children);
          } else {
            setCategories([]);
            setError('Category not found');
          }
        } else {
          setCurrentCategory(null);
          const rootCategories = allCategories.filter(c => !c.parentId);
          setCategories(rootCategories);
        }
      } catch (err) {
        setError('Failed to load categories');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
        <Link to="/categories" className="text-indigo-600 hover:underline mt-4 inline-block">
          Back to all categories
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {currentCategory ? currentCategory.name : 'Browse Categories'}
        </h1>
        {currentCategory && (
          <Link to="/categories" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Top
          </Link>
        )}
      </div>
      
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-6">
            No categories found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors mb-2">
                  {category.name}
                </h2>
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <span>View Subcategories</span>
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
