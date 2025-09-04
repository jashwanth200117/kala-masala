// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      method: "GET",
      credentials: "include", // 👈 send cookies
    });
    if (!res.ok) throw new Error("Not authenticated");
    return await res.json();
  } catch (err) {
    return thunkAPI.rejectWithValue("Not authenticated");
  }
});

const initialState = {
  user: null,
  loading: false,
  error: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutSuccess: (state) => {
      state.user = null;
    },
    setHydrated: (state, action) => {
      state.hydrated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.hydrated = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.hydrated = true;
      });
  },
});

export const { logoutSuccess, setHydrated } = authSlice.actions;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
