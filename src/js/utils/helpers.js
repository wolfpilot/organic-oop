/**
 * Given a value, returns a value that fits within the specified min and max
 * @param {Number} v - The supplied value to check against
 * @param {Number} min - The minimum value
 * @param {Number} max - The maximum value
 * @returns {number} - Return value that fits within specified parameters
 */
const valBetween = (v, min, max) => {
    return Math.min(max, Math.max(min, v));
};

export { valBetween };
