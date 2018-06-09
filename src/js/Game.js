// Modules
import Engine from './core/Engine';
import Input from './interface/Input';
import Canvas from './actors/Canvas';
import Creature from './actors/Creature';
import * as GUI from './interface/GUI';

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
    _setup() { // eslint-disable-line max-statements
        const canvasEl = document.getElementById('canvas');
        const ctx = canvasEl.getContext('2d');

        this._engine = new Engine(ctx);
        this._input = new Input(canvasEl);
        this._canvas = new Canvas(canvasEl);
        this._creature = new Creature(ctx);

        this._engine.init();
        this._input.init();
        this._canvas.init();
        this._creature.init();

        GUI.init();
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
