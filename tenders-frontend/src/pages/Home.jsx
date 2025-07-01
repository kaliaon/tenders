import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="bg-neutral-50">
      {/* Hero section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 h-3/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="pt-16 pb-24 md:pt-20 md:pb-32">
            <div className="text-center md:max-w-3xl md:mx-auto">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">{t("heroTitle")}</span>{" "}
                <span className="block text-primary-200">
                  {t("heroSubtitle")}
                </span>
              </h1>
              <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
                {t("heroDescription")}
              </p>
              <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                {isAuthenticated ? (
                  <div className="shadow rounded-md">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-800 bg-white hover:bg-neutral-100 md:py-4 md:text-lg md:px-10 transition-colors duration-150"
                    >
                      {t("goToDashboard")}
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="shadow rounded-md">
                      <Link
                        to="/register"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-800 bg-white hover:bg-neutral-100 md:py-4 md:text-lg md:px-10 transition-colors duration-150"
                      >
                        {t("getStarted")}
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link
                        to="/login"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md bg-primary-700 text-white hover:bg-primary-600 md:py-4 md:text-lg md:px-10 transition-colors duration-150"
                      >
                        {t("login")}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-neutral-900">
              {t("featuresSectionTitle")}
            </h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              {t("featuresSectionDescription")}
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-neutral-50 rounded-lg shadow-sm p-6 border border-neutral-200">
              <div className="w-12 h-12 rounded-md bg-primary-700 text-white flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
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
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                {t("featureBrowseTenders")}
              </h3>
              <p className="mt-2 text-neutral-600">
                {t("featureBrowseTendersDesc")}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg shadow-sm p-6 border border-neutral-200">
              <div className="w-12 h-12 rounded-md bg-primary-700 text-white flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
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
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                {t("featureStayUpdated")}
              </h3>
              <p className="mt-2 text-neutral-600">
                {t("featureStayUpdatedDesc")}
              </p>
            </div>

            <div className="bg-neutral-50 rounded-lg shadow-sm p-6 border border-neutral-200">
              <div className="w-12 h-12 rounded-md bg-primary-700 text-white flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-900">
                {t("featureStreamlined")}
              </h3>
              <p className="mt-2 text-neutral-600">
                {t("featureStreamlinedDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
