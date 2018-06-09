// Utils
import PubSub from '../utils/PubSub';

class Canvas {
    /**
     * @param {Object} element - The HTML5 Canvas element
     */
    constructor(element) {
        this._element = element;
    }

    _state = {
        fill: '#141414'
    };

    /**
     * @param {Object} ctx - The canvas context to draw onto
     * @private
     */
    _draw(ctx) {
        ctx.fillStyle = this._state.fill;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    /**
     * @param {Object} ctx - The canvas context to draw onto
     * @private
     */
    _clear(ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }

    /**
     * @param {Object} newState - Updated state to be merged
     * @private
     */
    _setState(newState) {
        this._state = { ...this._state, ...newState };
    }

    /**
     * @private
     */
    _addEventListeners() {
        window.addEventListener('resize', () => this._setSize());

        PubSub.subscribe('canvas:clear', ctx => this._clear(ctx));
        PubSub.subscribe('engine:draw', ctx => this._draw(ctx));
        PubSub.subscribe('gui:canvas', newState => this._setState(newState));
    }

    /**
     * @private
     */
    _setSize() {
        this._element.width = window.innerWidth;
        this._element.height = window.innerHeight;
    }

    /**
     * @public
     */
    init() {
        this._setSize();
        this._addEventListeners();
    }
}

export default Canvas;
