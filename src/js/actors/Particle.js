// Utils
import PubSub from '../utils/PubSub';
import { easeInExpo, easeInOutCubic } from '../utils/easings';
import { valBetween } from '../utils/helpers';

class Particle {
    /**
     * @param {Object} presets - The predefined config for this particle instance
     * @param {Number} presets.birthTime - Exact time when the particle was generated
     * @param {Number} presets.lifespan - Time of particle from birth to death in seconds
     * @param {Number} presets.x - The coordinate of the particle on the X axis
     * @param {Number} presets.y - The coordinate of the particle on the Y axis
     * @param {Number} presets.startRadius - Particle radius at birth
     * @param {Number} presets.endRadius - Particle radius at death
     * @param {Number} presets.startAlpha - Particle opacity at birth
     * @param {Number} presets.endAlpha - Particle opacity at death
     * @param {Object} presets.colour - Particle colour
     */
    constructor(presets) {
        this._presets = { ...presets };

        this._init();
    }

    static defaults = {
        minDeltaAlpha: 0.01, // Prevent stalling delta = 0
        maxDeltaAlpha: 1
    };

    /**
     * @param {Object} ctx - The canvas context to draw onto
     * @private
     */
    _draw(ctx) {
        ctx.beginPath();
        ctx.arc(this._presets.x, this._presets.y, this._state.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = `rgba(${this._presets.colour.r}, ${this._presets.colour.g}, ${this._presets.colour.b}, ${this._state.alpha})`;
        ctx.stroke();
        ctx.closePath();
    }

    /**
     * @private
     */
    _updateAlpha() {
        // The change in alpha
        const delta = this._presets.endAlpha - this._state.alpha;

        this._state.deltaAlpha = delta * easeInOutCubic(parseInt(this._state.elapsedLifecyclePercentage, 10) / 100);

        if (this._state.alpha >= this._presets.endAlpha) {
            this._state.alphaReset = true;
        }

        if (this._state.alphaReset) {
            // Prevent delta staying at 0
            this._state.deltaAlpha = -valBetween(this._state.deltaAlpha, Particle.defaults.minDeltaAlpha, Particle.defaults.maxDeltaAlpha);
        }

        this._state.alpha += this._state.deltaAlpha;
    }

    /**
     * @private
     */
    _updateRadius() {
        // The change in radius
        const delta = this._presets.endRadius - this._state.radius;

        this._state.radius += delta * easeInExpo(this._state.elapsedLifecyclePercentage / 100);
    }

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _update(timestamp) {
        this._state.elapsedLifecyclePercentage = 100 * (timestamp - this._presets.birthTime) / this._presets.lifespan;

        this._updateAlpha();
        this._updateRadius();

        if (this._state.elapsedLifecyclePercentage >= 100) {
            this.kill();
        }
    }

    /**
     * Kill particle forcefully
     * @TODO: Should ease out if particle doesn't die naturally
     * @TODO: such as when being called externally
     * @public
     */
    kill() {
        this.isAlive = false;

        PubSub.unsubscribe(this._subscriberUpdate);
        PubSub.unsubscribe(this._subscriberDraw);
    }

    /**
     * @private
     */
    _addEventListeners() {
        this._subscriberUpdate = PubSub.subscribe('engine:update', timestamp => this._update(timestamp));
        this._subscriberDraw = PubSub.subscribe('engine:draw', ctx => this._draw(ctx));
    }

    /**
     * @private
     */
    _setup() {
        this.isAlive = true;

        this._state = {
            elapsedLifecyclePercentage: 0,
            alpha: this._presets.startAlpha,
            alphaReset: false,
            deltaAlpha: 0,
            radius: this._presets.startRadius
        };
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
