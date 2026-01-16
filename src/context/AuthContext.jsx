// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { decodeToken, isTokenExpired } from "../Utils/jwt";

const AuthContext = createContext(null);

// .NET standard role claim type
const CLAIM_ROLE = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Helper to extract user info from token
  const processToken = (token) => {
    const decoded = decodeToken(token);
    if (!decoded) return null;

    // Handle case where role might be a single string or array, or under different keys
    const rawRole = decoded[CLAIM_ROLE] || decoded.role || decoded.Role || "User";
    
    return {
      ...decoded,
      // If user has multiple roles, rawRole might be an array. Ensure we handle that if needed.
      role: Array.isArray(rawRole) ? rawRole[0] : rawRole, 
      email: decoded.email || decoded.Email,
      id: decoded.nameid || decoded.sub // standard claim for ID
    };
  };

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      
      if (token && !isTokenExpired(token)) {
        const userPayload = processToken(token);
        setUser(userPayload);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post("/Auth/login", { email, password });
      
      // Handle PascalCase (Token) or camelCase (token) from backend
      const token = res.data.token || res.data.Token;
      const refreshToken = res.data.refreshToken || res.data.RefreshToken;

      if (!token || !refreshToken) {
        throw new Error("Invalid response from server");
      }
      
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const userPayload = processToken(token);
      setUser(userPayload);
      setIsAuthenticated(true);
      
      return res;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    // Backend expects: Username, Email, Password
    return await api.post("/Auth/register", { username, email, password });
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if(refreshToken) {
         // Explicitly calling the logout endpoint
         await api.post(`/Auth/logout?refreshToken=${encodeURIComponent(refreshToken)}`);
      }
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, register }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);