/**
 * Add global method if missing
 *
 * @author Paul Irish - https://github.com/paulirish
 */
export const requestAnimFrame = (() => {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (cb => {
            window.setTimeout(cb, 1000 / 60);
        });
})();
