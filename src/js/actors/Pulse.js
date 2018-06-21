// Utils
import PubSub from '../utils/PubSub';

// Constants
import { colours } from '../constants/colours';

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

    static presets = {
        lifespan: 1000, // In milliseconds
        interval: 1000, // Delay between generating new particles
        startRadius: 30,
        endRadius: 35,
        startAlpha: 0,
        endAlpha: 1
    };

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
            lifespan: Pulse.presets.lifespan,
            x: this._x,
            y: this._y,
            startRadius: Pulse.presets.startRadius,
            endRadius: Pulse.presets.endRadius,
            startAlpha: Pulse.presets.startAlpha,
            endAlpha: Pulse.presets.endAlpha,
            colour: colours[Math.floor(Math.random() * colours.length)] // Randomize colour
        };

        this._state.particles.push(new Particle(presets));
    }

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _update(timestamp) {
        // Generate a new particle each 'x' seconds
        if (parseInt((timestamp - this._state.prevTick) / Pulse.presets.interval, 10) >= 1) {
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
