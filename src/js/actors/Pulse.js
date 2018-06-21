// Utils
import PubSub from '../utils/PubSub';
import { randomFromArray } from '../utils/helpers';

// Constants
import { colours } from '../constants/colours';

// Modules
import Particle from './Particle';

class Pulse {
    /**
     * @param {Number} x - The starting coordinate of the pulse on the X axis
     * @param {Number} y - The starting coordinate of the pulse on the Y axis
     * @param {Object} pulse - The predefined pulse config
     */
    constructor(x, y, pulse) {
        this._x = x;
        this._y = y;
        this._pulse = pulse;
    }

    _state = {
        particles: [],
        prevTick: 0
    };

    /**
     * @private
     */
    _updateParticles() {
        // @NOTE: For more than, say, 10.000 particles think about using a standard 'for' loop
        this._state.particles.forEach((particle, index) => {
            if (!particle.isAlive) {
                this._state.particles.splice(index, 1);
            }
        });
    }

    /**
     * @private
     */
    _generateParticle() {
        const presets = {
            birthTime: this._state.prevTick,
            x: this._x,
            y: this._y,
            ...this._pulse,
            colour: randomFromArray(colours)
        };

        this._state.particles.push(new Particle(presets));
    }

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _update(timestamp) {
        // Generate a new particle each 'x' seconds
        if (parseInt((timestamp - this._state.prevTick) / this._pulse.interval, 10) >= 1) {
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
