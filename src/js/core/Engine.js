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
        fpsInterval: Engine.config.sampleFreq / Engine.config.fps,
        lastDrawTime: performance.now()
    };

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @public
     */
    run(timestamp) {
        PubSub.publish('engine:update', timestamp);

        // Elapsed time between rendered frames
        const elapsedInterval = timestamp - this._state.lastDrawTime;

        // Check if enough time has passed to render a new frame
        if (elapsedInterval > this._state.fpsInterval) {
            this._state.lastDrawTime = timestamp - (elapsedInterval % this._state.fpsInterval);

            PubSub.publish('canvas:clear', this.ctx);
            PubSub.publish('engine:draw', this.ctx);
        }
    }
}

export default Engine;
