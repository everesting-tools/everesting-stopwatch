export class UIController {
    constructor() {
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('start');
        this.pauseButton = document.getElementById('pause');
        this.resetButton = document.getElementById('reset');

        if (!this.timeDisplay || !this.startButton || !this.pauseButton || !this.resetButton) {
            throw new Error("Не найдены элементы интерфейса. Убедитесь, что DOM загружен.");
        }
    }

    updateTimeDisplay(timeString) {
        this.timeDisplay.textContent = timeString;
    }

    onStart(callback) {
        this.startButton.addEventListener('click', callback);
    }

    onPause(callback) {
        this.pauseButton.addEventListener('click', callback);
    }

    onReset(callback) {
        this.resetButton.addEventListener('click', callback);
    }
}
