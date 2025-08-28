// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import * as jwtDecodeNS from "jwt-decode"; // import namespace to avoid default/import mismatch

const safeDecode = (token) => {
  // jwt-decode might be exported as function (ESM) or as default property (CJS)
  if (!token) return null;
  if (typeof jwtDecodeNS === "function") return jwtDecodeNS(token);
  if (jwtDecodeNS && typeof jwtDecodeNS.default === "function") return jwtDecodeNS.default(token);
  // last resort, try named export 'jwtDecode' (some builds)
  if (jwtDecodeNS && typeof jwtDecodeNS.jwtDecode === "function") return jwtDecodeNS.jwtDecode(token);
  throw new Error("jwt-decode import shape is unexpected");
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const fetchMe = async (jwtToken) => {
    try {
      const res = await fetch("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!res.ok) throw new Error("Failed /me");
      return await res.json();
    } catch (err) {
      // fallback to token decode
      try {
        const decoded = safeDecode(jwtToken);
        return {
          username: decoded.username ?? decoded.sub ?? decoded.email,
          email: decoded.sub ?? decoded.email,
          id: decoded.uid ?? null,
          roles: decoded.roles ?? [],
        };
      } catch (e) {
        return null;
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      (async () => {
        const u = await fetchMe(storedToken);
        if (u) setUser(u);
        else {
          setToken(null);
          localStorage.removeItem("token");
        }
      })();
    }
  }, []);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = async (jwtToken) => {
    setToken(jwtToken);
    const u = await fetchMe(jwtToken);
    if (u) setUser(u);
    else {
      try {
        const decoded = safeDecode(jwtToken);
        setUser({
          username: decoded.username ?? decoded.sub ?? decoded.email,
          email: decoded.sub ?? decoded.email,
          id: decoded.uid ?? null,
          roles: decoded.roles ?? [],
        });
      } catch {
        setUser(null);
      }
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
