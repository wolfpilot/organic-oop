// Utils
import PubSub from '../utils/PubSub';

// Constants
import { colours } from '../constants/colours';

class Particle {
    /**
     * @param {Object} presets - The predefined config for this particle instance
     * @param {Number} presets.x - The coordinate of the particle on the X axis
     * @param {Number} presets.y - The coordinate of the particle on the Y axis
     * @param {Number} presets.radius - Radius of the particle
     * @param {Number} presets.lifespan - Time of particle from birth to death in seconds
     */
    constructor(presets) {
        this._x = presets.x;
        this._y = presets.y;
        this._radius = presets.radius;
        this._lifespan = presets.lifespan;

        this._init();
    }

    /**
     * @param {Object} ctx - The canvas context to draw onto
     * @private
     */
    _draw(ctx) {
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = `rgba(${colours[this._randomColour].r}, ${colours[this._randomColour].g}, ${colours[this._randomColour].b}, ${this._opacity})`;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * @private
     */
    _updateLifespan() {
        this._lifespan -= 0.1;

        if (this._lifespan <= 0) {
            this.isAlive = false;

            PubSub.unsubscribe(this._subscriberDraw);
        }
    }

    /**
     * Update various particle characteristics
     * Ex: Opacity, radius, colour
     * @private
     */
    _updateTraits() {
        this._opacity -= 1 / (this._lifespan / 0.1);
        this._radius -= this._radius / (this._lifespan / 0.1);

        if (this._opacity < 0) {
            this._opacity = 0;
        }

        if (this._radius < 0) {
            this._radius = 0;
        }
    }

    /**
     * @private
     */
    update() {
        this._updateTraits();
        this._updateLifespan();
    }

    /**
     * Kill particle forcefully
     * @public
     */
    die() {
        this.isAlive = false;
    }

    /**
     * @private
     */
    _addEventListeners() {
        this._subscriberDraw = PubSub.subscribe('engine:draw', ctx => this._draw(ctx));
    }

    /**
     * @private
     */
    _setup() {
        this._canvas = document.getElementById('canvas');

        this._randomColour = Math.floor(Math.random() * colours.length);
        this._opacity = 1;
        this.isAlive = true;
    }

    /**
     * @private
     */
    _init() {
        this._setup();
        this._addEventListeners();
    }
}

export default Particle;
