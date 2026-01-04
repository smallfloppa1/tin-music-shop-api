import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { store, type AppDispatch } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Categories from './pages/Categories';
import ProductList from './pages/ProductList';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import React, { useEffect } from 'react';
import { fetchUserProfile } from './store/authSlice';

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  return <>{children}</>;
};

function App() {
  return (
    <Provider store={store}>
      <AppInitializer>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/:slug" element={<Categories />} />
              <Route path="products/category/:categorySlug" element={<ProductList />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<Cart />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </AppInitializer>
    </Provider>
  );
}

export default App;
