import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-gray-300">
            &copy; {currentYear} {t("appName")}. {t("allRightsReserved")}
          </p>
          <a
            href="mailto:info@yourapp.com"
            className="text-gray-300 hover:text-white"
          >
            {t("contactEmail")}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
