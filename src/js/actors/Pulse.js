// Utils
import PubSub from '../utils/PubSub';

// Modules
import Particle from './Particle';

class Pulse {
    /**
     * @param {Number} x - The starting coordinate of the pulse on the X axis
     * @param {Number} y - The starting coordinate of the pulse on the Y axis
     */
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    static defaults = {
        interval: 1000,
        radius: 30,
        lifespan: 5
    };

    _state = {
        particles: [],
        prevTick: 0
    };

    /**
     * @private
     */
    _updateParticles() {
        this._state.particles.forEach((particle, index) => {
            if (!particle.isAlive) {
                this._state.particles.splice(index, 1);

                return;
            }

            particle.update();
        });
    }

    /**
     * @private
     */
    _generateParticle() {
        const presets = {
            x: this._x,
            y: this._y,
            radius: Pulse.defaults.radius,
            lifespan: Pulse.defaults.lifespan
        };

        this._state.particles.push(new Particle(presets));
    }

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _update(timestamp) {
        // Generate a new particle each 'x' seconds
        if (parseInt((timestamp - this._state.prevTick) / Pulse.defaults.interval, 10) >= 1) {
            // Keep an accurate timestamp of when the previous particle was generated
            this._state.prevTick = timestamp;

            this._generateParticle();
        }

        this._updateParticles();
    }

    /**
     * @private
     */
    _addEventListeners() {
        PubSub.subscribe('engine:update', timestamp => this._update(timestamp));
    }

    /**
     * @public
     */
    init() {
        this._addEventListeners();
    }
}

export default Pulse;
