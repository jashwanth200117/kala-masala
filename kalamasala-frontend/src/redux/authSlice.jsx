// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Fetch user details from backend using token
export const fetchMe = createAsyncThunk("auth/fetchMe", async (jwtToken, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    if (!res.ok) throw new Error("Failed /me");
    return await res.json();
  } catch (err) {
    // fallback decode from token
    try {
      const decoded = jwtDecode(jwtToken);
      return {
        username: decoded.username ?? decoded.sub ?? decoded.email,
        email: decoded.sub ?? decoded.email,
        id: decoded.uid ?? null,
        roles: decoded.roles ?? [],
      };
    } catch {
      return thunkAPI.rejectWithValue("Invalid token");
    }
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
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
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
        localStorage.removeItem("token");
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
