// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export const fetchMe = createAsyncThunk("auth/fetchMe", async (jwtToken, thunkAPI) => {
  try {
    const res = await fetch("http://localhost:8080/api/auth/me", {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    if (!res.ok) throw new Error("Failed /me");
    return await res.json();
  } catch (err) {
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
  token: null, // 👈 no manual localStorage here
  loading: false,
  error: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
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
      .addCase(fetchMe.rejected, (state, action) => {
        if (action.payload === "Invalid token") {
          state.user = null;
          state.token = null;
        }
        state.loading = false;
        state.error = action.payload || "Failed to fetch user";
        state.hydrated = true;
      });
  },
});

export const { loginSuccess, logout, setHydrated } = authSlice.actions;
export const selectUser = (state) => state.auth.user;

export default authSlice.reducer;
