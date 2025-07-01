/**
 * Format a date string to a localized format
 * @param {string|Date} dateString - Date string or Date object to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
