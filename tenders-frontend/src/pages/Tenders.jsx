import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TenderService from "../services/TenderService";
import { categories, statuses } from "../utils/mockData";
import { useTranslation } from "react-i18next";

const Tenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [deadlineFilter, setDeadlineFilter] = useState("");
  const [createdAfterFilter, setCreatedAfterFilter] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        let data;

        if (searchTerm) {
          // If there's a search term, use searchTenders
          data = await TenderService.searchTenders(searchTerm);

          // Apply filters to the search results if needed
          if (selectedCategory !== "All") {
            data = data.filter(
              (tender) => tender.category === selectedCategory
            );
          }

          if (selectedStatus !== "All") {
            data = data.filter((tender) => tender.status === selectedStatus);
          }

          // Apply budget filters
          if (minBudget) {
            data = data.filter((tender) => tender.budget >= Number(minBudget));
          }

          if (maxBudget) {
            data = data.filter((tender) => tender.budget <= Number(maxBudget));
          }

          // Apply date filters
          if (deadlineFilter) {
            data = data.filter(
              (tender) => new Date(tender.deadline) >= new Date(deadlineFilter)
            );
          }

          if (createdAfterFilter) {
            data = data.filter(
              (tender) =>
                new Date(tender.createdAt) >= new Date(createdAfterFilter)
            );
          }
        } else if (
          selectedCategory !== "All" ||
          selectedStatus !== "All" ||
          minBudget ||
          maxBudget ||
          deadlineFilter ||
          createdAfterFilter
        ) {
          // If only filters are applied, use filterTenders
          const filters = {};

          if (selectedCategory !== "All") {
            filters.category = selectedCategory;
          }

          if (selectedStatus !== "All") {
            filters.status = selectedStatus;
          }

          if (minBudget) {
            filters.minBudget = Number(minBudget);
          }

          if (maxBudget) {
            filters.maxBudget = Number(maxBudget);
          }

          if (deadlineFilter) {
            filters.deadlineAfter = deadlineFilter;
          }

          if (createdAfterFilter) {
            filters.createdAfter = createdAfterFilter;
          }

          data = await TenderService.filterTenders(filters);
        } else {
          // Get all tenders if no filters or search
          data = await TenderService.getAllTenders();
        }

        setTenders(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch tenders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTenders();
  }, [
    searchTerm,
    selectedCategory,
    selectedStatus,
    minBudget,
    maxBudget,
    deadlineFilter,
    createdAfterFilter,
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setMinBudget("");
    setMaxBudget("");
    setDeadlineFilter("");
    setCreatedAfterFilter("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // The search is already handled by the useEffect dependency
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("kk-KZ", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
          {t("tenders")}
        </h1>
        <Link
          to="/tenders/new"
          className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-4 rounded inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          {t("createNewTender")}
        </Link>
      </div>

      {/* Search and filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("search")}
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t("searchPlaceholder")}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div className="w-full md:w-48">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("category")}
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="All">{t("allCategories")}</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-48">
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("status")}
              </label>
              <select
                id="status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="All">{t("allStatuses")}</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-auto self-end">
              <button
                type="submit"
                className="w-full md:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded inline-flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("search")}
              </button>
            </div>
          </div>

          {/* Advanced Filters Toggle Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-sm flex items-center text-sky-600 hover:text-sky-800 font-medium"
            >
              {showAdvancedFilters ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {showAdvancedFilters
                ? t("hideAdvancedFilters") || "Hide Advanced Filters"
                : t("showAdvancedFilters") || "Show Advanced Filters"}
            </button>
          </div>

          {/* Advanced Filters Section */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t border-gray-200 transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {t("advancedFilters") || "Advanced Filters"}
                </h3>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-sm text-sky-600 hover:text-sky-800"
                >
                  {t("resetFilters") || "Reset All Filters"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Budget Range Filter */}
                <div>
                  <label
                    htmlFor="minBudget"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("minBudget") || "Min Budget (KZT)"}
                  </label>
                  <input
                    type="number"
                    id="minBudget"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    placeholder="0"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="maxBudget"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("maxBudget") || "Max Budget (KZT)"}
                  </label>
                  <input
                    type="number"
                    id="maxBudget"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    placeholder="1000000000"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                {/* Date Filters */}
                <div>
                  <label
                    htmlFor="deadlineFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("deadlineAfter") || "Deadline After"}
                  </label>
                  <input
                    type="date"
                    id="deadlineFilter"
                    value={deadlineFilter}
                    onChange={(e) => setDeadlineFilter(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="createdAfterFilter"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {t("createdAfter") || "Created After"}
                  </label>
                  <input
                    type="date"
                    id="createdAfterFilter"
                    value={createdAfterFilter}
                    onChange={(e) => setCreatedAfterFilter(e.target.value)}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : tenders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-gray-900 text-lg font-medium">
            {t("noTendersFound")}
          </h3>
          <p className="mt-1 text-gray-500">{t("tryDifferentFilters")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-neutral-200">
            {tenders.map((tender) => (
              <li key={tender.id} className="hover:bg-neutral-50">
                <Link
                  to={`/tenders/${tender.id}`}
                  className="block p-4 sm:px-6 sm:py-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-primary-700 truncate">
                          {tender.title}
                        </h3>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tender.status === "open"
                              ? "bg-green-100 text-green-800"
                              : tender.status === "closed"
                              ? "bg-red-100 text-red-800"
                              : tender.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {t(`status_${tender.status}`)}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-neutral-600 line-clamp-2">
                        {tender.description}
                      </p>

                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-neutral-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {tender.company}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0 sm:ml-6">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {tender.location}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-neutral-500 sm:mt-0">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-neutral-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>
                            {t("deadline")}:{" "}
                            <time dateTime={tender.deadline}>
                              {formatDate(tender.deadline)}
                            </time>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 hidden sm:block">
                      <span className="inline-flex items-center text-sm font-medium text-primary-600">
                        {formatCurrency(tender.budget)}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Tenders;
