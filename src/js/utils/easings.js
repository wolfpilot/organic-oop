export const easeInOutCubic = t => {
    return t < 0.5 ? 4 * t * t * t : ((t - 1) * ((2 * t) - 2) * ((2 * t) - 2)) + 1;
};

export const easeInExpo = t => {
    return t === 0 ? 0 : Math.pow(2, 10 * (t - 1));
};
