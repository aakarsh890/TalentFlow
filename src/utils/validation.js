// utils/validation.js

/**
 * Validate job title
 * @param {string} title
 * @returns {boolean}
 */
export const validateJobTitle = (title) => title.trim().length > 0;

/**
 * Generate slug from title
 * @param {string} title
 * @returns {string}
 */
export const generateSlug = (title) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

/**
 * Check if slug is unique
 * @param {string} slug
 * @param {Array} existingJobs
 * @returns {boolean}
 */
export const isSlugUnique = (slug, existingJobs) =>
  !existingJobs.some((job) => job.slug === slug);

/**
 * Validate assessment question
 * @param {object} question
 * @returns {boolean}
 */
export const validateQuestion = (question) => {
  if (!question.label || !question.type) return false;
  if (question.type === "numeric") {
    if (question.min !== undefined && question.max !== undefined) {
      return question.min <= question.max;
    }
  }
  return true;
};
