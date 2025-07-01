import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

const MainLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <footer className="bg-primary-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">{t("appName")}</h3>
              <p className="text-primary-200 text-sm mt-1">
                {t("footerTagline")}
              </p>
            </div>
            <div className="text-sm text-primary-200">
              © {new Date().getFullYear()} {t("appName")}.{" "}
              {t("allRightsReserved")}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
