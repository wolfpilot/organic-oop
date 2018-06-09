// Utils
import PubSub from '../utils/PubSub';

class Engine {
    /**
     * @param {Object} ctx - The drawing context
     */
    constructor(ctx) {
        this.ctx = ctx;
    }

    static config = {
        sampleFreq: 1000,
        fps: 30
    };

    _state = {
        fps: Engine.config.fps,
        lastDrawTime: performance.now()
    };

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @public
     */
    run(timestamp) {
        PubSub.publish('engine:update', timestamp);

        const fpsInterval = Engine.config.sampleFreq / this._state.fps;

        // Elapsed time between rendered frames
        const elapsedInterval = timestamp - this._state.lastDrawTime;

        // Check if enough time has passed to render a new frame
        if (elapsedInterval > fpsInterval) {
            this._state.lastDrawTime = timestamp - (elapsedInterval % fpsInterval);

            PubSub.publish('canvas:clear', this.ctx);
            PubSub.publish('engine:draw', this.ctx);
        }
    }

    /**
     * @param {Object} newState - Updated state to be merged
     * @private
     */
    _setState(newState) {
        // @TODO: Need custom function for deep merging objects
        this._state = { ...this._state, ...newState };
    }

    /**
     * @private
     */
    _addEventListeners() {
        PubSub.subscribe('gui:engine', newState => this._setState(newState));
    }

    /**
     * @public
     */
    init() {
        this._addEventListeners();
    }
}

export default Engine;
