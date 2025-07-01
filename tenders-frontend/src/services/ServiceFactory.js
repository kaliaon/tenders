import apiConfig from "../utils/apiConfig";
import api from "../utils/api";

/**
 * Service Factory to create API services that can switch between simulated and real backend
 */
class ServiceFactory {
  /**
   * Creates a service that can use either simulated or real backend
   * @param {Object} simulatedService - The simulated service implementation
   * @param {Object} endpointMap - Mapping of method names to API endpoints
   * @returns {Object} A service with the same methods that will use either simulation or real API
   */
  static createService(simulatedService, endpointMap) {
    const service = {};

    // For each method in the simulated service
    Object.getOwnPropertyNames(Object.getPrototypeOf(simulatedService))
      .filter((method) => method !== "constructor")
      .forEach((methodName) => {
        // Create a method that checks useBackend config and routes accordingly
        service[methodName] = async function (...args) {
          // If using real backend and endpoint exists for this method
          if (apiConfig.useBackend && endpointMap[methodName]) {
            try {
              const endpoint = endpointMap[methodName];

              // Default to GET method if not specified
              const method = endpoint.method || "get";
              // Use the URL from the endpoint map, or default to method name
              const url = endpoint.url || `/${methodName}`;

              // Parse any URL parameters if needed
              const parsedUrl =
                typeof endpoint.parseUrl === "function"
                  ? endpoint.parseUrl(url, ...args)
                  : url;

              // Get request data from args based on endpoint config
              const data = endpoint.getData
                ? endpoint.getData(...args)
                : args[0] || null;

              // Make the actual API call
              let response;

              switch (method.toLowerCase()) {
                case "get":
                  response = await api.get(parsedUrl, { params: data });
                  break;
                case "post":
                  response = await api.post(parsedUrl, data);
                  break;
                case "put":
                  response = await api.put(parsedUrl, data);
                  break;
                case "delete":
                  response = await api.delete(parsedUrl, { data });
                  break;
                default:
                  response = await api.get(parsedUrl, { params: data });
              }

              return response.data;
            } catch (error) {
              console.error(`Error in ${methodName}:`, error);
              throw error;
            }
          } else {
            // Use the simulated service implementation
            return simulatedService[methodName](...args);
          }
        };
      });

    return service;
  }
}

export default ServiceFactory;
