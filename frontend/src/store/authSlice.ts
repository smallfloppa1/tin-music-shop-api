import { createSlice, type PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { type UserDto } from '../types';
import { api } from '../api/axios';

interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
};

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<UserDto>('/user/me');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user profile');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user?: UserDto; token: string }>
    ) => {
      const { user, token } = action.payload;
      if (user) state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
