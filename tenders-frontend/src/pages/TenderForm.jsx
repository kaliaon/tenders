import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TenderService from "../services/TenderService";
import { categories, statuses } from "../utils/mockData";
import { useTranslation } from "react-i18next";

const TenderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { t } = useTranslation();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
    category: categories[0],
    status: "open",
    company: "",
    location: "",
    contact: "",
    requirements: [""],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is admin
    if (!isAdmin()) {
      navigate("/dashboard");
      return;
    }

    // If in edit mode, fetch tender data
    if (isEditMode) {
      const fetchTender = async () => {
        try {
          setLoading(true);
          const data = await TenderService.getTenderById(id);

          setFormData({
            title: data.title || "",
            description: data.description || "",
            budget: data.budget || "",
            deadline: data.deadline || "",
            category: data.category || categories[0],
            status: data.status || "open",
            company: data.company || "",
            location: data.location || "",
            contact: data.contact || "",
            requirements: data.requirements || [""],
          });

          setError(null);
        } catch (err) {
          setError(t("errorFetchingTender"));
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTender();
    }
  }, [id, isEditMode, isAdmin, navigate, t]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert budget to number when setting state
    if (name === "budget") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : parseInt(value, 10),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRequirementChange = (index, value) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements[index] = value;

    setFormData({
      ...formData,
      requirements: updatedRequirements,
    });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ""],
    });
  };

  const removeRequirement = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);

    setFormData({
      ...formData,
      requirements: updatedRequirements.length ? updatedRequirements : [""],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty requirements
    const filteredRequirements = formData.requirements.filter(
      (req) => req.trim() !== ""
    );

    // Validate form
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.budget
    ) {
      setError(t("pleaseCompleteRequiredFields"));
      return;
    }

    try {
      setSubmitting(true);

      const submitData = {
        ...formData,
        requirements: filteredRequirements,
      };

      if (isEditMode) {
        await TenderService.updateTender(id, submitData);
        navigate(`/tenders/${id}`);
      } else {
        const newTender = await TenderService.createTender(submitData);
        navigate(`/tenders/${newTender.id}`);
      }
    } catch (err) {
      setError(
        isEditMode ? t("errorUpdatingTender") : t("errorCreatingTender")
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
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
                  {isEditMode ? t("editTender") : t("createTender")}
                </span>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditMode ? t("editTender") : t("createTender")}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {isEditMode ? t("updateTenderInfo") : t("fillTenderDetails")}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 my-4">
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
        )}

        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("title")} *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("description")} *
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="company"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("company")} *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="company"
                    id="company"
                    required
                    value={formData.company}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("location")} *
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="location"
                    id="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="budget"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("budget")} *
                </label>
                <div className="mt-1">
                  <input
                    type="number"
                    name="budget"
                    id="budget"
                    required
                    min="0"
                    value={formData.budget}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="deadline"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("deadline")} *
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    name="deadline"
                    id="deadline"
                    required
                    value={formData.deadline}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("category")} *
                </label>
                <div className="mt-1">
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("status")} *
                </label>
                <div className="mt-1">
                  <select
                    id="status"
                    name="status"
                    required
                    value={formData.status}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {t(`status_${status}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700"
                >
                  {t("contactEmail")} *
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    name="contact"
                    id="contact"
                    required
                    value={formData.contact}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("requirements")}
                  </label>
                  <button
                    type="button"
                    onClick={addRequirement}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-sky-700 bg-sky-100 hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  >
                    {t("addRequirement")}
                  </button>
                </div>
                <div className="mt-1 space-y-3">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) =>
                          handleRequirementChange(index, e.target.value)
                        }
                        className="shadow-sm focus:ring-sky-500 focus:border-sky-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder={t("requirementPlaceholder")}
                      />
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="ml-2 inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Link
                  to={isEditMode ? `/tenders/${id}` : "/tenders"}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                >
                  {t("cancel")}
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                    submitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {submitting
                    ? t("saving")
                    : isEditMode
                    ? t("updateTender")
                    : t("createTender")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TenderForm;
