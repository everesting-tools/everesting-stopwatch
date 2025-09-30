export class Stopwatch {
    constructor(uiController, storageManager) {
        this.ui = uiController;
        this.storage = storageManager;

        this.startTime = null;
        this.elapsedTime = 0;
        this.isRunning = false;
        this.interval = null;

        this.loadState();
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startTime = Date.now() - this.elapsedTime;
            this.interval = setInterval(() => {
                this.elapsedTime = Date.now() - this.startTime;
                this.updateDisplay();
            }, 100);
            this.saveState();
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.interval);
            this.isRunning = false;
            this.saveState();
        }
    }

    reset() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.elapsedTime = 0;
        this.startTime = null;
        this.updateDisplay();
        this.saveState();
    }

    updateDisplay() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        this.ui.updateTimeDisplay(`${hours}:${minutes}:${seconds}`);
    }

    saveState() {
        if (this.storage) {
            this.storage.save({
                startTime: this.startTime,
                elapsedTime: this.elapsedTime,
                isRunning: this.isRunning
            });
        }
    }

    loadState() {
        if (this.storage) {
            const state = this.storage.load();
            if (state) {
                this.startTime = state.startTime || null;
                this.elapsedTime = state.elapsedTime || 0;
                this.isRunning = state.isRunning || false;

                if (this.isRunning) {
                    this.start();
                } else {
                    this.updateDisplay();
                }
            }
        }
    }
    }
