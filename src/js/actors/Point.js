/**
 * @NOTE: So that they can also move by themselves and have own state
 * @TODO: Add more explanations
 */
class Point {
    /**
     * @TODO: Object presets?
     * @param angle
     */
    constructor(angle) {
        this._angle = angle;

        this._init();
    }

    /**
     * @private
     */
    _init() {
        this.x = (window.innerWidth / 2) + (100 * Math.cos(this._angle));
        this.y = (window.innerHeight / 2) + (100 * Math.sin(this._angle));
    }
}

export default Point;
