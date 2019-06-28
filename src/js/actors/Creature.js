// Utils
import PubSub from '../utils/PubSub';
import * as vectorHelpers from '../utils/vectorHelpers';

// Constants
import { PI2 } from '../constants/math';
import * as pulsations from '../constants/pulsations';

// Modules
import Point from './Point';

// @TODO: Pass random starting position to constructor later on
class Creature {
    static defaults = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        pulse: pulsations.standard,



        numOfPoints: 6, // default 12
        radius: 100,
        color: '#ffffff' // @TODO: Randomise
    };

    // functions to calc a point on circumference of circle
    static getXX(a) {
        return Creature.defaults.x + (Creature.defaults.radius * Math.cos(a));
    }

    static getYY(a) {
        return Creature.defaults.y + (Creature.defaults.radius * Math.sin(a));
    }

    /**
     * @TODO: Switch (via GUI) between this and debug mode with lines on
     * @param {Object} ctx - The canvas context to draw onto
     * @private
     */
    _draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this._arcs[0].x0, this._arcs[0].y0);

        this._arcs.forEach(arc => {
            // ctx.quadraticCurveTo(arc.cpX, arc.cpY, arc.x1, arc.y1);
            ctx.lineTo(arc.x1, arc.y1);
        });

        ctx.strokeStyle = Creature.defaults.color;
        ctx.stroke();
    }


    /**
     *
     * @param i
     * @returns {{x0: *, y0: *, x1: *, y1: *, cpX: number, cpY: number}}
     * @private
     */
    _makeArc(i) {
        // starting & ending angles vs center point
        const startAngle = this._sweep * (i - 1);
        const endAngle = this._sweep * i;

        // given start & end points,
        // calc the point on circumference at middle of sweep angle

        // @NOTE: point 0
        const x0 = Creature.getXX(startAngle);
        const y0 = Creature.getYY(startAngle);

        // @NOTE: middle point
        const xMid = Creature.getXX((startAngle + endAngle) / 2);
        const yMid = Creature.getYY((startAngle + endAngle) / 2);

        // @NOTE: point 1
        const x1 = Creature.getXX(endAngle);
        const y1 = Creature.getYY(endAngle);

        // calc middle control point
        const cpX = (2 * xMid) - ((x0 + x1) / 2);
        const cpY = (2 * yMid) - ((y0 + y1) / 2);

        return {
            x0: x0,
            y0: y0,
            x1: x1,
            y1: y1,
            cpX: cpX,
            cpY: cpY
        };
    }




    // @TODO: push/pull points;
    // @TODO: Update arcs
    _makeArcNew(i) {
        // calc the control points to pass a qCurve
        // through the 3 points
        // var dx = x2 - x1;
        // var dy = y2 - y1;
        // var a = Math.atan2(dy, dx);

        const p0 = this._points[i];

        // @TODO: Find more elegant solution
        // @TODO: Also, this should be calc / get arcs so we can also update these
        // @TODO: when the points are pushed
        let p1;
        if (i === this._points.length - 1) {
            p1 = this._points[0];
        } else {
            p1 = this._points[i + 1];
        }

        // Calc middle point
        const angle = p0._angle + p1._angle;
        const xMid = Creature.getXX(angle / 2);
        const yMid = Creature.getYY(angle / 2);

        // Calc control point
        const cpX = vectorHelpers.getControlPointCoords(xMid, p0.x, p0.y);
        const cpY = vectorHelpers.getControlPointCoords(yMid, p1.x, p1.y);

        // @TODO: If last point, last point = first point

        return {
            x0: p0.x,
            y0: p0.y,
            x1: p1.x,
            y1: p1.y,
            cpX: cpX,
            cpY: cpY
        };
    }

    /**
     * @param {Number} i - Index of the current point
     * @returns {Point} - A new instance of a Point particle
     * @private
     */
    _getPoint(i) {
        return new Point(this._sweep * (i - 1));
    }

    /**
     * @private
     */
    _addEventListeners() {
        this._subscriberDraw = PubSub.subscribe('engine:draw', ctx => this._draw(ctx));
    }

    /**
     * @private
     */
    _setup() {
        // @NOTE: Move to state if either of these become dynamic
        this._sweep = PI2 / Creature.defaults.numOfPoints; // Value in radians
        this._points = [...new Array(Creature.defaults.numOfPoints)].fill({}).map((_, i) => this._getPoint(i));
        this._arcs = this._points.map((_, i) => this._makeArc(i));

        // console.log(this._points);
        console.log(this._arcs);

        this._arcsNew = [...new Array(Creature.defaults.numOfPoints)].fill({}).map((_, i) => this._makeArcNew(i));

        console.log(this._arcsNew);
    }

    /**
     * @public
     */
    init() {
        // const pulse = new Pulse(Creature.defaults.x, Creature.defaults.y, Creature.defaults.pulse);

        // pulse.init();

        this._setup();
        this._addEventListeners();
    }
}

export default Creature;
