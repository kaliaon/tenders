import { mockTenders } from "../utils/mockData";
import ServiceFactory from "./ServiceFactory";
import apiConfig from "../utils/apiConfig";

class TenderServiceSimulated {
  constructor() {
    this.initializeData();
  }

  // Initialize data if not already in localStorage
  initializeData() {
    if (!localStorage.getItem("tenders")) {
      localStorage.setItem("tenders", JSON.stringify(mockTenders));
    }

    if (!localStorage.getItem("nextTenderId")) {
      localStorage.setItem(
        "nextTenderId",
        JSON.stringify(mockTenders.length + 1)
      );
    }

    if (!localStorage.getItem("subscriptions")) {
      localStorage.setItem("subscriptions", JSON.stringify([]));
    }
  }

  // Get all tenders
  getAllTenders() {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];
        resolve(tenders);
      }, apiConfig.simulateNetworkDelay); // Use configured network delay
    });
  }

  // Get tender by ID
  getTenderById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];
        const tender = tenders.find((t) => t.id === parseInt(id));

        if (tender) {
          resolve(tender);
        } else {
          reject(new Error("Tender not found"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Create a new tender
  createTender(tenderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];
        let nextId = JSON.parse(localStorage.getItem("nextTenderId")) || 1;

        const newTender = {
          id: nextId,
          ...tenderData,
          createdAt: new Date().toISOString().split("T")[0],
          status: tenderData.status || "open",
        };

        tenders.push(newTender);
        nextId++;

        localStorage.setItem("tenders", JSON.stringify(tenders));
        localStorage.setItem("nextTenderId", JSON.stringify(nextId));

        resolve(newTender);
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Update an existing tender
  updateTender(id, tenderData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];
        const index = tenders.findIndex((t) => t.id === parseInt(id));

        if (index !== -1) {
          tenders[index] = {
            ...tenders[index],
            ...tenderData,
            id: parseInt(id), // Ensure ID remains the same
          };

          localStorage.setItem("tenders", JSON.stringify(tenders));
          resolve(tenders[index]);
        } else {
          reject(new Error("Tender not found"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Delete a tender
  deleteTender(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];
        const index = tenders.findIndex((t) => t.id === parseInt(id));

        if (index !== -1) {
          tenders.splice(index, 1);
          localStorage.setItem("tenders", JSON.stringify(tenders));
          resolve({ success: true });
        } else {
          reject(new Error("Tender not found"));
        }
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Search tenders
  searchTenders(query) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];

        // Handle if query is string or object
        const searchString =
          typeof query === "string"
            ? query
            : query && query.searchTerm
            ? query.searchTerm
            : "";

        // Case insensitive search across title and description
        const results = tenders.filter((tender) => {
          const searchableText = (
            tender.title +
            " " +
            tender.description +
            " " +
            tender.company +
            " " +
            tender.category
          ).toLowerCase();

          return searchableText.includes(searchString.toLowerCase());
        });

        resolve(results);
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Filter tenders by criteria
  filterTenders(filters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let tenders = JSON.parse(localStorage.getItem("tenders")) || [];

        if (
          filters.category &&
          filters.category !== "all" &&
          filters.category !== "All"
        ) {
          tenders = tenders.filter((t) => t.category === filters.category);
        }

        if (
          filters.status &&
          filters.status !== "all" &&
          filters.status !== "All"
        ) {
          tenders = tenders.filter(
            (t) => t.status === filters.status.toLowerCase()
          );
        }

        if (filters.minBudget) {
          tenders = tenders.filter((t) => t.budget >= filters.minBudget);
        }

        if (filters.maxBudget) {
          tenders = tenders.filter((t) => t.budget <= filters.maxBudget);
        }

        // Handle deadline date filter
        if (filters.deadlineAfter) {
          const deadlineDate = new Date(filters.deadlineAfter);
          tenders = tenders.filter((t) => new Date(t.deadline) >= deadlineDate);
        }

        // Handle created date filter
        if (filters.createdAfter) {
          const createdDate = new Date(filters.createdAfter);
          tenders = tenders.filter((t) => new Date(t.createdAt) >= createdDate);
        }

        resolve(tenders);
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Subscribe to tender updates
  subscribeTender(tenderId, userId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const subscriptions =
          JSON.parse(localStorage.getItem("subscriptions")) || [];

        // Check if already subscribed
        const existingSubscription = subscriptions.find(
          (s) =>
            s.tenderId === parseInt(tenderId) && s.userId === parseInt(userId)
        );

        if (existingSubscription) {
          reject(new Error("Already subscribed to this tender"));
          return;
        }

        // Add new subscription
        const newSubscription = {
          id: Date.now(),
          tenderId: parseInt(tenderId),
          userId: parseInt(userId),
          createdAt: new Date().toISOString(),
        };

        subscriptions.push(newSubscription);
        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

        resolve(newSubscription);
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Unsubscribe from tender updates
  unsubscribeTender(tenderId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let subscriptions =
          JSON.parse(localStorage.getItem("subscriptions")) || [];

        subscriptions = subscriptions.filter(
          (s) =>
            !(
              s.tenderId === parseInt(tenderId) && s.userId === parseInt(userId)
            )
        );

        localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

        resolve({ success: true });
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Get user subscriptions
  getUserSubscriptions(userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscriptions =
          JSON.parse(localStorage.getItem("subscriptions")) || [];
        const userSubscriptions = subscriptions.filter(
          (s) => s.userId === parseInt(userId)
        );

        // Get the details of subscribed tenders
        const tenders = JSON.parse(localStorage.getItem("tenders")) || [];
        const subscribedTenders = userSubscriptions.map((sub) => {
          const tender = tenders.find((t) => t.id === sub.tenderId);
          return {
            subscription: sub,
            tender: tender || { id: sub.tenderId, title: "Unknown Tender" },
          };
        });

        resolve(subscribedTenders);
      }, apiConfig.simulateNetworkDelay);
    });
  }

  // Check if user is subscribed to a tender
  isUserSubscribed(tenderId, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscriptions =
          JSON.parse(localStorage.getItem("subscriptions")) || [];
        const isSubscribed = subscriptions.some(
          (s) =>
            s.tenderId === parseInt(tenderId) && s.userId === parseInt(userId)
        );

        resolve(isSubscribed);
      }, apiConfig.simulateNetworkDelay);
    });
  }
}

// Define the API endpoint mapping for TenderService
const tenderEndpoints = {
  getAllTenders: {
    method: "get",
    url: "/tenders",
    getData: () => ({}),
  },
  getTenderById: {
    method: "get",
    url: "/tenders/:id",
    parseUrl: (url, id) => url.replace(":id", id),
    getData: (id) => ({ id }),
  },
  createTender: {
    method: "post",
    url: "/tenders",
  },
  updateTender: {
    method: "put",
    url: "/tenders/:id",
    parseUrl: (url, id) => url.replace(":id", id),
    getData: (id, data) => data,
  },
  deleteTender: {
    method: "delete",
    url: "/tenders/:id",
    parseUrl: (url, id) => url.replace(":id", id),
  },
  searchTenders: {
    method: "get",
    url: "/tenders/search",
    getData: (query) => ({ query }),
  },
  filterTenders: {
    method: "get",
    url: "/tenders/filter",
    getData: (filters) => filters,
  },
  subscribeTender: {
    method: "post",
    url: "/tenders/:id/subscribe",
    parseUrl: (url, tenderId) => url.replace(":id", tenderId),
    getData: (tenderId, userId) => ({ userId }),
  },
  unsubscribeTender: {
    method: "delete",
    url: "/tenders/:id/subscribe",
    parseUrl: (url, tenderId) => url.replace(":id", tenderId),
    getData: (tenderId, userId) => ({ userId }),
  },
  getUserSubscriptions: {
    method: "get",
    url: "/users/:id/subscriptions",
    parseUrl: (url, userId) => url.replace(":id", userId),
    getData: (userId) => ({ userId: userId }),
  },
  isUserSubscribed: {
    method: "get",
    url: "/tenders/:tenderId/subscriptions/:userId",
    parseUrl: (url, tenderId, userId) =>
      url.replace(":tenderId", tenderId).replace(":userId", userId),
    getData: (tenderId, userId) => ({ tenderId, userId }),
  },
};

// Create the service instance using our factory
const simulatedService = new TenderServiceSimulated();
const TenderService = ServiceFactory.createService(
  simulatedService,
  tenderEndpoints
);

export default TenderService;
