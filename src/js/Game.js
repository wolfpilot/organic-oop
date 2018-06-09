// Modules
import Engine from './core/Engine';
import Canvas from './actors/Canvas';

class Game {
    _state = {
        isPaused: false
    };

    /**
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _tick(timestamp = 0) {
        if (this._state.isPaused) { return; }

        this._engine.run(timestamp);

        window.requestAnimationFrame(nextTimestamp => this._tick(nextTimestamp));
    }

    /**
     * @private
     */
    _setup() {
        const canvasEl = document.getElementById('canvas');
        const ctx = canvasEl.getContext('2d');

        this._engine = new Engine(ctx);
        this._canvas = new Canvas(canvasEl);

        this._canvas.init();
    }

    /**
     * @public
     */
    init() {
        this._setup();
        this._tick();
    }
}

// Export as Singleton
export default new Game();
