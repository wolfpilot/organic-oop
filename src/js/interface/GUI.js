// External
import dat from 'dat.gui';

// Utils
import PubSub from '../utils/PubSub';

const presets = {
    folders: {
        engine: {
            fps: 30
        }
    }
};

/**
 * @public
 */
const init = () => {
    const GUI = new dat.GUI();

    const engine = GUI.addFolder('Engine');

    engine.add(presets.folders.engine, 'fps', 0, 60, 1)
        .name('FPS')
        .onChange(value => {
            PubSub.publish('gui:engine', { fps: value });
        });
};

export { init };
