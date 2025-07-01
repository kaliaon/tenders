import { Outlet, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-primary-900 to-primary-700 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link to="/" className="text-3xl font-bold text-white">
            {t("appName")}
          </Link>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <Outlet />
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="font-medium text-primary-100 hover:text-white transition-colors duration-150"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
