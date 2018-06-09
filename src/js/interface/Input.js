// Utils
import PubSub from '../utils/PubSub';

class Input {
    /**
     * @param {Object} canvas - The HTML5 Canvas element
     */
    constructor(canvas) {
        this._canvas = canvas;
    }

    /**
     * @param {Object} e - The mouse event
     * @private
     */
    _handleMouseMove(e) {
        this._mouse.x = parseInt(e.clientX - this._bounds.left, 10);
        this._mouse.y = parseInt(e.clientY - this._bounds.top, 10);

        PubSub.publish('mouse:move', { ...this._mouse });
    }

    /**
     * @private
     */
    _addEventListeners() {
        document.addEventListener('mousemove', e => this._handleMouseMove(e));
    }

    /**
     * @private
     */
    _setup() {
        this._mouse = {};

        // @TODO: Bounds will need to be recalculated on resize
        // @TODO: Create global resize listener and add this to local state.
        this._bounds = this._canvas.getBoundingClientRect();
    }

    /**
     * @public
     */
    init() {
        this._setup();
        this._addEventListeners();
    }
}

export default Input;
