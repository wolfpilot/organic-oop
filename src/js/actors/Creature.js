// Constants
import * as pulsations from '../constants/pulsations';

// Modules
import Pulse from './Pulse';

// @TODO: Pass random starting position to constructor later on
class Creature {
    static defaults = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        pulse: pulsations.standard
    };

    /**
     * @public
     */
    init() {
        const pulse = new Pulse(Creature.defaults.x, Creature.defaults.y, Creature.defaults.pulse);

        pulse.init();
    }
}

export default Creature;
