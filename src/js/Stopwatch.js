// src/js/Stopwatch.js

import { AudioManager } from './AudioManager.js';

export class Stopwatch {
    constructor(ui) {
        this.ui = ui;
        this.audio = new AudioManager();
        this.isRunning = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.laps = [];
        this.currentLapStartTime = null;
        this.currentLapPauseTime = 0;
        this.isPaused = false;
        this.currentPauseStart = null;
        this.state = 'initial';

        this.ui.updateState(this.state);

        this.ui.bindStart(() => this.handleStart());
        this.ui.bindLap(() => this.recordLap());
        this.ui.bindPause(() => this.togglePause());
        this.ui.bindFinish(() => this.finish());
        this.ui.bindReset(() => this.reset());

        this.ui.hideActiveControls();
        this.ui.hideResetButton();
        this.ui.hideTime();
        console.log("✅ Stopwatch: инициализирован");
    }

    handleStart() {
        console.log("▶️ Start вызван");
        this.audio.playStartupBeeps();
        this.audio.onStartupComplete = () => {
            this.start();
        };
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.state = 'running';
            this.ui.updateState(this.state);

            const now = Date.now();
            this.startTime = now - this.elapsedTime;
            this.currentLapStartTime = now;
            this.tick();

            this.ui.hideStartButton();
            this.ui.showActiveControls();
            this.ui.hideResetButton();
            this.ui.showTime();
            console.log("✅ Таймер запущен");
        }
    }

    togglePause() {
        console.log("⏸️ Pause переключён");
        if (!this.isRunning) return;

        this.audio.playPauseSound();

        if (this.isPaused) {
            const pauseDuration = Date.now() - this.currentPauseStart;
            this.currentLapPauseTime += pauseDuration;
            this.currentPauseStart = null;
            this.isPaused = false;
            this.ui.pauseButton.textContent = "PAUSE";
            console.log(`⏸️ Пауза завершена. Длительность: ${pauseDuration} мс`);
        } else {
            this.currentPauseStart = Date.now();
            this.isPaused = true;
            this.ui.pauseButton.textContent = "RESUME";
            console.log("⏸️ Пауза активирована");
        }
    }

    recordLap() {
        console.log("🔂 Lap зафиксирован");
        if (!this.isRunning) return;

        this.audio.playLapSound();

        const now = Date.now();
        const lapDuration = (now - this.currentLapStartTime) + this.currentLapPauseTime;
        const lapNumber = this.laps.length + 1;

        const lapTimeStr = this.formatTime(lapDuration);
        const pauseTimeStr = this.formatTime(this.currentLapPauseTime);
        const totalTimeStr = this.formatTime(this.elapsedTime);

        this.laps.push({
            number: lapNumber,
            time: lapDuration,
            pauses: this.currentLapPauseTime
        });

        this.ui.addLapRow(lapNumber, lapTimeStr, pauseTimeStr, totalTimeStr);

        this.currentLapStartTime = now;
        this.currentLapPauseTime = 0;
    }

    finish() {
        console.log("🏁 Finish вызван");
        if (!this.isRunning) return;

        this.audio.playFinishSound();

        if (this.laps.length === 0 || this.currentLapStartTime !== null) {
            this.recordLap();
        }

        this.isRunning = false;
        this.isPaused = false;
        this.state = 'finished';
        this.ui.updateState(this.state);

        this.ui.hideActiveControls();
        this.ui.showResetButton();
        console.log("✅ Забег завершён");
    }

    reset() {
        console.log("🔄 Reset вызван");

        this.audio.playResetSound();

        this.isRunning = false;
        this.isPaused = false;
        this.elapsedTime = 0;
        this.laps = [];
        this.currentLapStartTime = null;
        this.currentLapPauseTime = 0;
        this.currentPauseStart = null;
        this.state = 'initial';
        this.ui.updateState(this.state);

        this.ui.updateTimeDisplay("00:00:00");
        this.ui.hideTime();
        this.ui.showStartButton();
        this.ui.hideActiveControls();
        this.ui.hideResetButton();
        this.ui.pauseButton.textContent = "PAUSE";
        this.ui.clearLapsTable();
        console.log("✅ Сброс завершён");
    }

    tick() {
        if (!this.isRunning) return;

        if (!this.isPaused) {
            this.elapsedTime = Date.now() - this.startTime;
        }

        this.ui.updateTimeDisplay(this.formatTime(this.elapsedTime));

        setTimeout(() => this.tick(), 100);
    }

    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
}
