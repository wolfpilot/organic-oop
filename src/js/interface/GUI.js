// External
import dat from 'dat.gui';

// Utils
import PubSub from '../utils/PubSub';

const presets = {
    pause: false,
    folders: {
        engine: {
            fps: 30
        },
        canvas: {
            fill: '#141414'
        }
    }
};

/**
 * @public
 */
const init = () => {
    const GUI = new dat.GUI();

    const engine = GUI.addFolder('Engine');
    const canvas = GUI.addFolder('Canvas');

    GUI.add(presets, 'pause')
        .name('Pause')
        .onChange(value => {
            PubSub.publish('gui:game', { isPaused: value });
        });

    engine.add(presets.folders.engine, 'fps', 0, 60, 1)
        .name('FPS')
        .onChange(value => {
            PubSub.publish('gui:engine', { fps: value });
        });

    canvas.addColor(presets.folders.canvas, 'fill')
        .name('Fill')
        .onChange(value => {
            PubSub.publish('gui:canvas', { fill: value });
        });
};

export { init };
