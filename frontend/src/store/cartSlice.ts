import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../api/axios';
import { type CartDto, type AddToCartDto } from '../types';

interface CartState {
  cart: CartDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CartDto>('/cart');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data: AddToCartDto, { rejectWithValue }) => {
    try {
      const response = await api.post<CartDto>('/cart', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: number, { rejectWithValue }) => {
    try {
      const response = await api.delete<CartDto>(`/cart/${itemId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart');
      return null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(addToCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(removeFromCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(clearCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearCart.fulfilled, (state) => {
      state.loading = false;
      state.cart = { id: 0, totalAmount: 0, items: [] };
    });
    builder.addCase(clearCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
