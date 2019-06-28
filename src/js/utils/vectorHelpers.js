export const dx = (point1, point2) => {
    return point2.x - point1.x;
};

export const dy = (point1, point2) => {
    return point2.y - point1.y;
};

export const distanceBetween = (point1, point2) => {
    return Math.sqrt(
        Math.pow(dx(point1, point2), 2) +
        Math.pow(dy(point1, point2), 2)
    );
};

export const angleTowards = (point1, point2) => {
    return Math.atan2(dy(point1, point2), dx(point1, point2));
};

// // functions to calc a point on circumference of circle
// export const getXX = a => {
//     return Creature.presets.x + (Creature.presets.radius * Math.cos(a));
// };

// @TODO: Same as above? origin + (radius * sin/cos angle)
// @TODO: as in, vector length * sin OR cos angle
// export const getProjection = (vector1, vector2) => {
//     let length = Math.cos(vector2.angle - vector1.angle) * vector1.length;
//
//     return new Vector(vector2.angle, length);
// };

export const averageCoords = (point1, point2) => {
    return (point1.x + point2.x) / 2;
};

/**
 * Based on the formula for quadratic bezier curves:
 * x(t) = x0 * (1-t)^2 + 2 * x1 * t * (1 - t) + x2 * t^2
 * which for a t (tangent) value of 1/2, the middle of the curve
 * would be reduced to cp = 2 * xt - (x0 + x2) / 2
 * @param {Number} xt - The tangent point to curve through
 * @param {Number} x0 - Start point of the curve
 * @param {Number} x2 - End point of the curve
 */
export const getControlPointCoords = (xt, x0, x2) => {
    return 2 * xt - (x0 + x2) / 2;
};