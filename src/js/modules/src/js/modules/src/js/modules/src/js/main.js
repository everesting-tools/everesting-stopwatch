import { UIController } from './modules/UIController.js';
import { Stopwatch } from './modules/Stopwatch.js';
import { LocalStorageManager } from './modules/LocalStorageManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    const storage = new LocalStorageManager();
    const stopwatch = new Stopwatch(ui, storage);

    ui.onStart(() => stopwatch.start());
    ui.onPause(() => stopwatch.pause());
    ui.onReset(() => stopwatch.reset());
});
