// В начале файла — импортируем AudioManager
import { AudioManager } from './AudioManager.js';

// В конструкторе:
constructor(uiController) {
    this.ui = uiController;
    this.audio = new AudioManager();

    // ... остальные поля ...

    // Привязка событий
    this.ui.onStart(() => this.handleStartClick());
    this.ui.onLap(() => this.recordLap());
    this.ui.onPauseToggle(() => this.togglePause());
    this.ui.onFinish(() => this.finish());
    this.ui.onReset(() => this.reset());
    this.ui.onToggleLapsTable(() => this.toggleLapsTable());
    this.ui.onExportMarkdown(() => this.exportToMarkdown());

    this.updateDisplay();
}

handleStartClick() {
    // Проигрываем звук старта
    this.audio.playStartupBeeps();
    this.audio.onStartupComplete = () => {
        this.start();
    };
}

start() {
    if (!this.isRunning) {
        this.isRunning = true;
        const now = Date.now();
        this.startTime = now - this.elapsedTime;
        this.currentLapStartTime = now;

        this.interval = setInterval(() => {
            if (!this.isPaused) {
                this.elapsedTime = Date.now() - this.startTime;
            }
            this.updateDisplay();
        }, 100);

        this.ui.hideStartButton();
        this.ui.showActiveControls();
        this.ui.hideResetButton();
        this.ui.hideSummaryTable(); // на случай, если была видна
    }
}

recordLap() {
    if (!this.isRunning) return;

    this.audio.playLapSound();

    const now = Date.now();
    let lapDuration = (now - this.currentLapStartTime) + this.currentLapPauseTime;

    const lapNumber = this.laps.length + 1;
    const lapTimeStr = this.formatTime(lapDuration);
    const pauseTimeStr = this.formatTime(this.currentLapPauseTime);
    const totalTimeStr = this.formatTime(this.elapsedTime);

    this.laps.push({
        number: lapNumber,
        time: lapDuration,
        pausesSum: this.currentLapPauseTime,
        total: this.elapsedTime
    });

    this.ui.addLapRow(lapNumber, lapTimeStr, pauseTimeStr, totalTimeStr);

    this.currentLapStartTime = now;
    this.currentLapPauseTime = 0;
}

togglePause() {
    if (!this.isRunning) return;

    if (this.isPaused) {
        const pauseDuration = Date.now() - this.currentPauseStart;
        this.currentLapPauseTime += pauseDuration;
        this.currentPauseStart = null;
        this.isPaused = false;
        this.ui.pauseButton.textContent = "Пауза";
        this.audio.playPauseSound();
    } else {
        this.currentPauseStart = Date.now();
        this.isPaused = true;
        this.ui.pauseButton.textContent = "Продолжить";
        this.audio.playPauseSound();
    }
}

finish() {
    if (!this.isRunning) return;

    this.audio.playFinishSound();

    if (this.laps.length === 0 || this.currentLapStartTime !== null) {
        this.recordLap();
    }

    clearInterval(this.interval);
    this.isRunning = false;
    this.isPaused = false;

    this.ui.hideActiveControls();
    this.ui.showResetButton();
    this.ui.showExportButton();
    this.showSummary(); // ← ПОКАЗЫВАЕМ ТАБЛИЦУ ИТОГОВ
}

showSummary() {
    if (this.laps.length === 0) return;

    const totalLaps = this.laps.length;
    const totalTime = this.formatTime(this.elapsedTime);
    const totalPauses = this.formatTime(
        this.laps.reduce((sum, lap) => sum + lap.pausesSum, 0)
    );
    const netTime = this.formatTime(
        this.elapsedTime - this.laps.reduce((sum, lap) => sum + lap.pausesSum, 0)
    );

    this.ui.clearSummaryTable();
    this.ui.addSummaryRow(totalLaps, totalTime, totalPauses, netTime);
    this.ui.showSummaryTable();
}

reset() {
    this.audio.playResetSound();

    clearInterval(this.interval);
    this.isRunning = false;
    this.isPaused = false;
    this.elapsedTime = 0;
    this.startTime = null;
    this.laps = [];
    this.currentLapStartTime = null;
    this.currentLapPauseTime = 0;
    this.currentPauseStart = null;

    this.ui.clearLapsTable();
    this.ui.clearSummaryTable();
    this.ui.updateTimeDisplay("00:00:00");
    this.ui.showStartButton();
    this.ui.hideActiveControls();
    this.ui.hideResetButton();
    this.ui.hideExportButton();
    this.ui.hideLapsTable();
    this.ui.hideSummaryTable();
    this.ui.pauseButton.textContent = "Пауза";
}

toggleLapsTable() {
    if (this.ui.lapsTableContainer.classList.contains('hidden')) {
        this.ui.showLapsTable();
    } else {
        this.ui.hideLapsTable();
    }
}

exportToMarkdown() {
    let md = "# Отчёт о забеге\n\n";
    md += "## Таблица кругов\n\n";
    md += "| Круг | Время круга | Паузы | Общее время |\n";
    md += "|------|-------------|-------|-------------|\n";

    this.laps.forEach(lap => {
        md += `| ${lap.number} | ${this.formatTime(lap.time)} | ${this.formatTime(lap.pausesSum)} | ${this.formatTime(lap.total)} |\n`;
    });

    md += "\n## Итоги\n\n";
    md += "| Всего кругов | Общее время | Сумма пауз | Чистое время |\n";
    md += "|--------------|-------------|------------|--------------|\n";

    const totalLaps = this.laps.length;
    const totalTime = this.formatTime(this.elapsedTime);
    const totalPauses = this.formatTime(
        this.laps.reduce((sum, lap) => sum + lap.pausesSum, 0)
    );
    const netTime = this.formatTime(
        this.elapsedTime - this.laps.reduce((sum, lap) => sum + lap.pausesSum, 0)
    );

    md += `| ${totalLaps} | ${totalTime} | ${totalPauses} | ${netTime} |\n`;

    // Скачиваем файл
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `everesting-${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
                         }
