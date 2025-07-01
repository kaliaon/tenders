import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import TenderService from "../services/TenderService";
import { formatDate } from "../utils/dateUtils";

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [tenders, setTenders] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get recent tenders
        const tendersData = await TenderService.getAllTenders();
        // Sort by date and take most recent 5
        const recentTenders = tendersData
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setTenders(recentTenders);

        // Get user's subscriptions if logged in
        if (user) {
          const subsData = await TenderService.getUserSubscriptions(user.id);
          setSubscriptions(subsData);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const recentSubscriptions = subscriptions
    .slice(0, 3)
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  const upcomingDeadlines = tenders
    .filter(
      (tender) =>
        tender.status === "open" &&
        new Date(tender.deadline) > new Date() &&
        new Date(tender.deadline) <
          new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    )
    .sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )
    .slice(0, 3);

  return (
    <div>
      <div className="pb-5 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-primary-800">
          {t("welcomeToDashboard")}
        </h1>
        <p className="mt-2 text-neutral-600">
          {t("user")}: {user?.full_name}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5 mt-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">
          {t("quickActions")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/tenders"
            className="p-4 flex flex-col items-center bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-primary-50 hover:border-primary-200 transition-colors duration-150"
          >
            <svg
              className="w-6 h-6 text-primary-700 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-neutral-900 font-medium text-sm">
              {t("browseTenders")}
            </span>
          </Link>
          <Link
            to="/dashboard/subscriptions"
            className="p-4 flex flex-col items-center bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-primary-50 hover:border-primary-200 transition-colors duration-150"
          >
            <svg
              className="w-6 h-6 text-primary-700 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="text-neutral-900 font-medium text-sm">
              {t("manageSubs")}
            </span>
          </Link>
          <Link
            to="/dashboard/profile"
            className="p-4 flex flex-col items-center bg-neutral-50 rounded-lg border border-neutral-200 hover:bg-primary-50 hover:border-primary-200 transition-colors duration-150"
          >
            <svg
              className="w-6 h-6 text-primary-700 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-neutral-900 font-medium text-sm">
              {t("updateProfile")}
            </span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
          <h2 className="text-lg font-semibold text-neutral-900">
            {t("activeTenders")}
          </h2>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {loading
              ? "..."
              : tenders.filter((t) => t.status === "open").length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5">
          <h2 className="text-lg font-semibold text-neutral-900">
            {t("mySubscriptions")}
          </h2>
          <p className="text-3xl font-bold text-primary-700 mt-2">
            {loading ? "..." : subscriptions.length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-5 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            {t("recentActivity")}
          </h2>
          <div className="text-xs text-neutral-500">
            {t("activityUpdated")}: {formatDate(new Date())}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-neutral-600">{t("processing")}</div>
          ) : (
            <>
              {recentSubscriptions.length > 0 ? (
                <div>
                  <h3 className="text-md font-medium text-neutral-800 mb-2">
                    {t("newTendersAvailable")}
                  </h3>
                  <ul className="space-y-2">
                    {recentSubscriptions.map((sub) => (
                      <li
                        key={sub.id}
                        className="p-3 bg-neutral-50 rounded border border-neutral-200"
                      >
                        <Link
                          to={`/tenders/${sub.tender.id}`}
                          className="text-primary-700 hover:text-primary-500 font-medium"
                        >
                          {sub.tender.title}
                        </Link>
                        <p className="text-sm text-neutral-600 mt-1">
                          {formatDate(sub.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-neutral-600">No recent subscriptions</div>
              )}

              {upcomingDeadlines.length > 0 ? (
                <div className="mt-6">
                  <h3 className="text-md font-medium text-neutral-800 mb-2">
                    {t("tendersClosingSoon")}
                  </h3>
                  <ul className="space-y-2">
                    {upcomingDeadlines.map((tender) => (
                      <li
                        key={tender.id}
                        className="p-3 bg-neutral-50 rounded border border-neutral-200"
                      >
                        <Link
                          to={`/tenders/${tender.id}`}
                          className="text-primary-700 hover:text-primary-500 font-medium"
                        >
                          {tender.title}
                        </Link>
                        <p className="text-sm text-neutral-600 mt-1">
                          {t("deadline")}: {formatDate(tender.deadline)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-neutral-600">No tenders closing soon</div>
              )}
            </>
          )}
        </div>

        <div className="mt-4 text-right">
          <Link
            to="/tenders"
            className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-600"
          >
            {t("viewAllTenders")}
            <svg
              className="ml-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
