import { main } from './js/main';

const isReady = () => {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    });
};

isReady().then(() => main());
