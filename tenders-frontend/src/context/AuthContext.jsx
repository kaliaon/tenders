import { createContext, useState, useContext, useEffect } from "react";
import UserService from "../services/UserService";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await UserService.login(email, password);
      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      setLoading(false);
      return loggedInUser;
    } catch (err) {
      setError(err.message || "Login failed");
      setLoading(false);
      throw err;
    }
  };

  const register = async (full_name, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const userData = {
        email,
        password,
        full_name,
      };

      const registeredUser = await UserService.register(userData);

      // Automatically log in the user after registration
      setUser(registeredUser);
      localStorage.setItem("user", JSON.stringify(registeredUser));

      setLoading(false);
      return registeredUser;
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateProfile = async (userData) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const updatedUser = await UserService.updateUserProfile(
        user.id,
        userData
      );
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLoading(false);
      return updatedUser;
    } catch (err) {
      setError(err.message || "Failed to update profile");
      setLoading(false);
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      await UserService.changePassword(user.id, currentPassword, newPassword);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Failed to change password");
      setLoading(false);
      throw err;
    }
  };

  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
