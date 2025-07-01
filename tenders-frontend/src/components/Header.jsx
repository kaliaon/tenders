import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <header className="bg-primary-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold text-white">
              {t("appName")}
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center">
            <div className="flex space-x-4 mr-4">
              <Link
                to="/"
                className="text-primary-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                {t("home")}
              </Link>
              <Link
                to="/tenders"
                className="text-primary-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
              >
                {t("tenders")}
              </Link>
            </div>
            <LanguageSwitcher />
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-800 bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors duration-150"
              >
                {t("dashboard")}
              </Link>
            ) : (
              <div className="flex space-x-4 ml-4">
                <Link
                  to="/login"
                  className="text-primary-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-primary-800 bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors duration-150"
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-200 hover:text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-150"
            >
              <span className="sr-only">{t("openMenu")}</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-primary-700">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-primary-100 hover:text-white hover:bg-primary-600 transition-colors duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("home")}
            </Link>
            <Link
              to="/tenders"
              className="block px-3 py-2 text-base font-medium text-primary-100 hover:text-white hover:bg-primary-600 transition-colors duration-150"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("tenders")}
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-primary-600">
            <div className="flex justify-center mb-4">
              <LanguageSwitcher />
            </div>
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="block text-center mx-4 my-2 px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-800 bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("dashboard")}
              </Link>
            ) : (
              <div className="space-y-2 px-4">
                <Link
                  to="/login"
                  className="block text-center py-2 text-base font-medium text-primary-100 hover:text-white transition-colors duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("login")}
                </Link>
                <Link
                  to="/register"
                  className="block text-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-800 bg-white hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300 transition-colors duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t("signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
