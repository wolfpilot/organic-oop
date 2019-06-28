/**
 * Linear interpolation function
 * @param {Number} a - The first value
 * @param {Number} b - The second value
 * @param {Number} x - Interpolation percentage between 0 and 1
 * @returns {Number} - The resulting value
 */
export const lerp = (a, b, x) => {
    return a + (x * (b - a));
};
