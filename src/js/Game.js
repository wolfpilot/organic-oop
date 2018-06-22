// Utils
import PubSub from './utils/PubSub';

// Modules
import Engine from './core/Engine';
import Input from './interface/Input';
import Canvas from './actors/Canvas';
import Creature from './actors/Creature';
import * as GUI from './interface/GUI';

class Game {
    static defaults = {
        /** External **/
        timestamp: 0, // Internal browser clock timestamp since page was loaded, cannot be paused
        /** Game **/
        isPaused: false, // On / off state
        startTimestamp: performance.now(), // First iteration timestamp
        elapsedTime: 0, // Total elapsed time
        pausedTimestamp: 0, // Last paused timestamp
        pausedTime: 0 // Total pause time
    };

    /**
     * @TODO: Move loop to engine
     * @param {Number} timestamp - The current elapsed time in milliseconds
     * @private
     */
    _tick(timestamp) {
        if (this._state.isPaused) { return; }

        this._state.timestamp = timestamp;
        this._state.elapsedTime = (timestamp - Game.defaults.startTimestamp) - this._state.pausedTime;

        this._engine.run(this._state.elapsedTime);

        requestAnimationFrame(nextTimestamp => this._tick(nextTimestamp));
    }

    /**
     * @param {Object} newState - Updated state to be merged
     * @private
     */
    _setState(newState) {
        this._state = { ...this._state, ...newState };
    }

    /**
     * @param {Object} newState - Updated state to be merged
     * @private
     */
    _onPause(newState) {
        this._setState(newState);

        if (this._state.isPaused) {
            this._state.pausedTimestamp = performance.now();
        }

        if (!this._state.isPaused) {
            // @NOTE: Update timestamp since the one cached in the loop is outdated by now
            this._state.timestamp = performance.now();

            this._state.pausedTime = this._state.pausedTime + (this._state.timestamp - this._state.pausedTimestamp);
            this._state.elapsedTime = (this._state.timestamp - Game.defaults.startTimestamp) - this._state.pausedTime;

            requestAnimationFrame(timestamp => this._tick(timestamp));
        }
    }

    /**
     * @private
     */
    _addEventListeners() {
        PubSub.subscribe('gui:game', newState => this._onPause(newState));
    }

    /**
     * @private
     */
    _setup() { // eslint-disable-line max-statements
        const canvasEl = document.getElementById('canvas');
        const ctx = canvasEl.getContext('2d');

        this._state = {
            timestamp: Game.defaults.timestamp,
            isPaused: Game.defaults.isPaused,
            startTimestamp: Game.defaults.startTimestamp,
            elapsedTime: Game.defaults.elapsedTime,
            pausedTimestamp: Game.defaults.pausedTimestamp,
            pausedTime: Game.defaults.pausedTime
        };

        // @TODO: Pass the Canvas instance to the Engine and get the ctx from that
        this._engine = new Engine(ctx);
        this._input = new Input(canvasEl);
        this._canvas = new Canvas(canvasEl);
        this._creature = new Creature();

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
        this._addEventListeners();
        this._tick(Game.defaults.startTimestamp);
    }
}

// Export as Singleton
export default new Game();
