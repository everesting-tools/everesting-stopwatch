// src/js/main.js

import { UIController } from './UIController.js';
import { Stopwatch } from './Stopwatch.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("📄 DOM загружен");

    const ui = new UIController();
    const stopwatch = new Stopwatch(ui);

    console.log("✅ Всё инициализировано");
});
