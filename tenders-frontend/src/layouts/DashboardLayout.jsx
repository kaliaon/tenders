import { useState } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigation = [
    { name: t("dashboard"), href: "/dashboard", icon: HomeIcon },
    {
      name: t("mySubscriptions"),
      href: "/dashboard/subscriptions",
      icon: BellIcon,
    },
    { name: t("tenders"), href: "/tenders", icon: ClipboardDocumentIcon },
    { name: t("profile"), href: "/dashboard/profile", icon: UserIcon },
  ];

  // Add "Create Tender" link for admins
  if (isAdmin()) {
    navigation.splice(3, 0, {
      name: t("createTender"),
      href: "/tenders/new",
      icon: ClipboardDocumentIcon,
    });
  }

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-800">
                  {t("appName")}
                </span>
              </Link>
            </div>

            {/* Desktop menu */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center
                    ${
                      isActive(item.href)
                        ? "bg-primary-100 text-primary-800"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    }
                    `}
                  >
                    <item.icon className="mr-1.5 h-5 w-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <div className="relative">
                <div className="flex items-center">
                  <span className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </span>
                  <span className="ml-2 text-sm font-medium text-neutral-700">
                    {user?.full_name || t("user")}
                  </span>

                  <button
                    onClick={handleLogout}
                    className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-primary-600 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <ArrowRightOnRectangleIcon
                      className="mr-1.5 -ml-0.5 h-4 w-4"
                      aria-hidden="true"
                    />
                    {t("logout")}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button*/}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                <span className="sr-only">{t("openMenu")}</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium flex items-center
                    ${
                      isActive(item.href)
                        ? "bg-primary-100 text-primary-800"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                    }
                  `}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-neutral-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <span className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-white" />
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-neutral-800">
                    {user?.full_name || t("user")}
                  </div>
                  <div className="text-sm font-medium text-neutral-500">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800"
                >
                  {t("logout")}
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Bottom tabs for mobile navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-10">
        <div className="grid grid-cols-4 h-16">
          {navigation.slice(0, 4).map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center space-y-1
                ${
                  isActive(item.href)
                    ? "text-primary-600"
                    : "text-neutral-600 hover:text-neutral-800"
                }
              `}
            >
              <item.icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <main className="py-6 sm:py-10 pb-safe sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
