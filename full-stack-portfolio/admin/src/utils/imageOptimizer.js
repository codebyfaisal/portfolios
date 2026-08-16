/**
 * Optimizes Cloudinary URLs by injecting transformation parameters.
 * @param {string} url - The original Cloudinary URL
 * @param {object} options - Optimization options
 * @param {number} options.width - Request specific width
 * @param {number} options.height - Request specific height
 * @param {string} options.crop - Crop mode (default: 'limit')
 * @returns {string} - The optimized URL
 */
export const optimizeImage = (url, { width, height, crop = "limit" } = {}) => {
    if (!url) return "";
    if (!url.includes("cloudinary.com")) return url;

    // Split URL at /upload/
    const [base, file] = url.split("/upload/");
    if (!file) return url;

    const transformations = ["f_auto", "q_auto"];

    if (width) transformations.push(`w_${width}`);
    if (height) transformations.push(`h_${height}`);
    if (width || height) transformations.push(`c_${crop}`);

    return `${base}/upload/${transformations.join(",")}/${file}`;
};
