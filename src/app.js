import Game from './js/Game';

const isReady = () => {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    });
};

isReady().then(() => Game.init());
