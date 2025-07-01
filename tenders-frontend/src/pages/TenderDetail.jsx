import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import TenderService from "../services/TenderService";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const TenderDetail = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const { user, isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTender = async () => {
      try {
        setLoading(true);
        const data = await TenderService.getTenderById(id);
        setTender(data);

        // Check if the user is subscribed
        if (isAuthenticated && user) {
          const isSubscribed = await TenderService.isUserSubscribed(
            id,
            user.id
          );
          setSubscribed(isSubscribed);
        }
      } catch (err) {
        setError(t("errorFetchingTender"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTender();
  }, [id, isAuthenticated, user, t]);

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setSubscribing(true);
      if (subscribed) {
        await TenderService.unsubscribeTender(id, user.id);
        setSubscribed(false);
      } else {
        await TenderService.subscribeTender(id, user.id);
        setSubscribed(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubscribing(false);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin() || !confirm(t("confirmDeleteTender"))) {
      return;
    }

    try {
      await TenderService.deleteTender(id);
      navigate("/tenders");
    } catch (err) {
      setError(t("errorDeletingTender"));
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("kk-KZ", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
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
              <div className="mt-4">
                <Link
                  to="/tenders"
                  className="text-sm font-medium text-sky-600 hover:text-sky-500"
                >
                  {t("backToTenders")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="container mx-auto px-4 py-8">
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
            {t("tenderNotFound")}
          </h3>
          <div className="mt-4">
            <Link
              to="/tenders"
              className="text-sm font-medium text-sky-600 hover:text-sky-500"
            >
              {t("backToTenders")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <nav className="mb-4 sm:mb-0">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  {t("home")}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link
                  to="/tenders"
                  className="text-gray-500 hover:text-gray-700"
                >
                  {t("tenders")}
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <span className="text-gray-700 font-semibold">
                  {tender.title}
                </span>
              </li>
            </ol>
          </nav>
          <div className="flex space-x-2">
            {isAdmin() && (
              <>
                <Link
                  to={`/tenders/${id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  {t("edit")}
                </Link>
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {t("delete")}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {tender.title}
            </h2>
            <p className="text-sm text-gray-500">
              {t("publishedOn")} {formatDate(tender.createdAt)}
            </p>
          </div>
          <div className="flex space-x-2 items-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
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
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {tender.category}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("company")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {tender.company}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("budget")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatCurrency(tender.budget)}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("deadline")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(tender.deadline)}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("location")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {tender.location}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("contact")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {tender.contact}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("description")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {tender.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                {t("requirements")}
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {tender.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate">
                          {requirement}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {tender.status === "open" ? (
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">{t("interestedInTender")}</p>
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  subscribed
                    ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "bg-sky-600 hover:bg-sky-700 focus:ring-sky-500"
                } ${subscribing ? "opacity-75 cursor-not-allowed" : ""}`}
              >
                {subscribing
                  ? t("processing")
                  : subscribed
                  ? t("unsubscribe")
                  : t("subscribe")}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center">
              {t("tenderClosed")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
