import { mockUsers } from "../utils/mockData";
import ServiceFactory from "./ServiceFactory";
import apiConfig from "../utils/apiConfig";

class UserServiceSimulated {
  constructor() {
    this.initializeData();
  }

  // Initialize data if not already in localStorage
  initializeData() {
    if (!localStorage.getItem("users")) {
      localStorage.setItem("users", JSON.stringify(mockUsers));
    }
  }

  // Login user
  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("users")) || [];
          const foundUser = users.find(
            (u) => u.email === email && u.password === password
          );

          if (foundUser) {
            // Don't include password in the response
            const { password, ...userWithoutPassword } = foundUser;
            resolve(userWithoutPassword);
          } else {
            reject(new Error("Invalid email or password"));
          }
        } catch (err) {
          reject(new Error("Login failed"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Register new user
  register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem("users")) || [];

          // Check if user already exists
          const userExists = users.some((u) => u.email === userData.email);
          if (userExists) {
            reject(new Error("User with this email already exists"));
            return;
          }

          // Create new user with 'user' role by default
          const newUser = {
            id: Date.now(),
            ...userData,
            role: userData.role || "user",
            token: `mock-token-${Date.now()}`,
          };

          users.push(newUser);
          localStorage.setItem("users", JSON.stringify(users));

          // Don't include password in the response
          const { password, ...userWithoutPassword } = newUser;
          resolve(userWithoutPassword);
        } catch (err) {
          reject(new Error("Registration failed"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Get user profile
  getUserProfile(userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find((u) => u.id === parseInt(userId));

        if (user) {
          // Don't include password in the response
          const { password, ...userWithoutPassword } = user;
          resolve(userWithoutPassword);
        } else {
          reject(new Error("User not found"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Update user profile
  updateUserProfile(userId, userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex((u) => u.id === parseInt(userId));

        if (index !== -1) {
          // Don't allow updating email or role via this method for security
          const { email, role, password, ...allowedUpdates } = userData;

          users[index] = {
            ...users[index],
            ...allowedUpdates,
          };

          localStorage.setItem("users", JSON.stringify(users));

          // Don't include password in the response
          const { password: pw, ...userWithoutPassword } = users[index];
          resolve(userWithoutPassword);
        } else {
          reject(new Error("User not found"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Change user password
  changePassword(userId, currentPassword, newPassword) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex((u) => u.id === parseInt(userId));

        if (index === -1) {
          reject(new Error("User not found"));
          return;
        }

        // Verify current password
        if (users[index].password !== currentPassword) {
          reject(new Error("Current password is incorrect"));
          return;
        }

        // Update password
        users[index].password = newPassword;
        localStorage.setItem("users", JSON.stringify(users));

        resolve({ success: true });
      }, apiConfig.simulateNetworkDelay);
    });
  }
}

// Define the API endpoint mapping for UserService
const userEndpoints = {
  login: {
    method: "post",
    url: "/auth/login",
    getData: (email, password) => ({ email, password }),
  },
  register: {
    method: "post",
    url: "/auth/register",
    getData: (userData) => userData,
  },
  getUserProfile: {
    method: "get",
    url: "/users/:id",
    parseUrl: (url, id) => url.replace(":id", id),
    getData: (id) => ({ id }),
  },
  updateUserProfile: {
    method: "put",
    url: "/users/:id",
    parseUrl: (url, id) => url.replace(":id", id),
    getData: (id, data) => data,
  },
  changePassword: {
    method: "put",
    url: "/users/:id/password",
    parseUrl: (url, id) => url.replace(":id", id),
    getData: (id, currentPassword, newPassword) => ({
      currentPassword,
      newPassword,
    }),
  },
};

// Create the service instance using our factory
const simulatedService = new UserServiceSimulated();
const UserService = ServiceFactory.createService(
  simulatedService,
  userEndpoints
);

export default UserService;
