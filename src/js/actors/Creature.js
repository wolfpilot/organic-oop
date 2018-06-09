// Utils
import { easeInOutCubic } from '../utils/easings';
import PubSub from '../utils/PubSub';

class Creature {
    /**
     * @param {Object} ctx - The canvas context to draw onto
     */
    constructor(ctx) {
        this._ctx = ctx;
    }

    static config = {
        pulseSpeed: 2000
    };

    _state = {
        pulses: [
            {
                prevTick: 0,
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                startRadius: 50,
                endRadius: 0,
                radius: 50,
                defaultOpacity: 0,
                lineWidth: 2,
                strokeStyle: {
                    r: 255,
                    g: 255,
                    b: 255,
                    a: 0
                }
            }
        ]
    };


    /**
     * Update pulse opacity
     * @param {Object} state - Old state
     * @param {Number} elapsedLifecyclePercentage - The current completion percentage of a start - end cycle
     * @returns {Number} - The updated opacity value
     * @private
     */
    static _updateOpacity(state, elapsedLifecyclePercentage) {
        if (elapsedLifecyclePercentage === 0) {
            return 0;
        }

        // The rate of change
        const dx = 1 - state.strokeStyle.a;

        state.strokeStyle.a += dx * easeInOutCubic(elapsedLifecyclePercentage / 100);

        return state.strokeStyle.a;
    }

    /**
     * Update pulse radius
     * @param {Object} state - Old state
     * @param {Number} elapsedLifecyclePercentage - The current completion percentage of a start - end cycle
     * @returns {Number} - The updated radius value
     * @private
     */
    static _updateRadius(state, elapsedLifecyclePercentage) {
        if (elapsedLifecyclePercentage === 0) {
            return state.startRadius;
        }

        // The rate of change
        const dx = 0 - state.radius;

        state.radius += dx * easeInOutCubic(elapsedLifecyclePercentage / 100);

        return state.radius;
    }

    /**
     * Create a new pulse
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @param {Object} state - Old pulse state
     * @returns {Object} nextState - New pulse state
     * @private
     */
    static _makePulse(timestamp, state) {
        if (!timestamp) { return state; }

        let nextState = { ...state };

        /** @NOTE: Can prevTick be initialised to 0 if undefined? Don't update state directly! */
        if (parseInt((timestamp - state.prevTick) / Creature.config.pulseSpeed, 10) >= 1) {
            nextState.prevTick = timestamp;
        }

        /**
         * @NOTE: Can also have a flag for hasLifecycleEnded = true/false
         * @NOTE: if (!hasLifecycleEnded) { return; } if needed
         *
         * @NOTE: Is this state or just a calculation?
         * @NOTE: func calculateLifecycle()?
         */
        const elapsedLifecyclePercentage = parseInt(100 * (timestamp - nextState.prevTick) / Creature.config.pulseSpeed, 10);

        nextState.strokeStyle.a = Creature._updateOpacity(state, elapsedLifecyclePercentage);
        nextState.radius = Creature._updateRadius(state, elapsedLifecyclePercentage);

        return nextState;
    }

    /**
     * Update state
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _update(timestamp) {
        if (!this._state.pulses) { return; }

        const nextState = { ...this._state };

        nextState.pulses = this._state.pulses.map(pulse => Creature._makePulse(timestamp, pulse));

        this._state = { ...nextState };
    }

    /**
     * Render new state
     * @param {Object} ctx - The canvas context to draw onto
     * @private
     */
    _draw(ctx) {
        this._state.pulses.forEach(pulse => {
            ctx.beginPath();
            ctx.arc(pulse.x, pulse.y, pulse.radius, 0, 2 * Math.PI);
            ctx.lineWidth = pulse.lineWidth;
            ctx.strokeStyle = `rgba(${pulse.strokeStyle.r}, ${pulse.strokeStyle.g}, ${pulse.strokeStyle.b}, ${pulse.strokeStyle.a}`;
            ctx.stroke();
        });
    }

    /**
     * @private
     */
    _addEventListeners() {
        PubSub.subscribe('engine:update', timestamp => this._update(timestamp));
        PubSub.subscribe('engine:draw', ctx => this._draw(ctx));
    }

    /**
     * @public
     */
    init() {
        this._addEventListeners();
    }
}

export default Creature;
