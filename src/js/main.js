import { UIController } from './modules/UIController.js';
import { Stopwatch } from './modules/Stopwatch.js';

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UIController();
    const stopwatch = new Stopwatch(ui);
});
