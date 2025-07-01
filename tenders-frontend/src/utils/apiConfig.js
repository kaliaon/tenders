// API Configuration settings

// Development environment settings
const DEV_CONFIG = {
  useBackend: true, // Always use real backend API
  apiBaseUrl: "https://tenders-backend.onrender.com/api", // Default backend API URL
  simulateNetworkDelay: 0, // No simulated delay
};

// Production environment settings
const PROD_CONFIG = {
  useBackend: true, // Always use real backend in production
  apiBaseUrl:
    import.meta.env.VITE_API_URL || "https://tenders-backend.onrender.com/api",
  simulateNetworkDelay: 0, // No simulated delay in production
};

// Test environment settings
const TEST_CONFIG = {
  useBackend: true, // Use real API in test environment
  apiBaseUrl: "http://localhost:8000/api",
  simulateNetworkDelay: 0, // No delay in tests
};

// Determine which configuration to use based on the environment
const isProduction = import.meta.env.PROD;
const isTest = import.meta.env.MODE === "test";

// Export the appropriate configuration
let apiConfig = DEV_CONFIG;

if (isProduction) {
  apiConfig = PROD_CONFIG;
} else if (isTest) {
  apiConfig = TEST_CONFIG;
}

// Allow for runtime configuration changes (useful for debugging or testing)
export const updateApiConfig = (newConfig) => {
  apiConfig = { ...apiConfig, ...newConfig };

  // If we're in development, we can log the configuration change
  if (!isProduction) {
    console.log("API config updated:", apiConfig);
  }

  return apiConfig;
};

export default apiConfig;
