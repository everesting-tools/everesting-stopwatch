// src/js/modules/UIController.js

export class UIController {
    constructor() {
        // Основные элементы времени и управления
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('start');
        this.lapButton = document.getElementById('lap');
        this.pauseButton = document.getElementById('pause');
        this.finishButton = document.getElementById('finish');
        this.resetButton = document.getElementById('reset');
        this.exportMarkdownBtn = document.getElementById('exportMarkdown');

        // Группы кнопок
        this.activeControls = document.getElementById('activeControls');

        // Инструкция
        this.instruction = document.getElementById('instruction');

        // Таблица кругов
        this.lapsTableContainer = document.getElementById('lapsTableContainer');
        this.lapsTableBody = document.getElementById('lapsTableBody');
        this.toggleLapsTableBtn = document.getElementById('toggleLapsTable');

        // Таблица итогов
        this.summaryTableContainer = document.getElementById('summaryTableContainer');
        this.summaryTableBody = document.getElementById('summaryTableBody');

        // Проверка существования критических элементов
        if (!this.timeDisplay || !this.startButton || !this.toggleLapsTableBtn) {
            throw new Error("Не найдены ключевые элементы интерфейса. Проверьте разметку index.html.");
        }

        // Изначальное состояние: скрыть активные элементы
        this.hideActiveControls();
        this.hideResetButton();
        this.hideExportButton();
        this.hideLapsTable();
        this.hideSummaryTable();

        // Привязка переключателя таблицы кругов
        this.toggleLapsTableBtn.addEventListener('click', () => {
            if (this.lapsTableContainer.classList.contains('hidden')) {
                this.showLapsTable();
            } else {
                this.hideLapsTable();
            }
        });
    }

    // ======================
    // УПРАВЛЕНИЕ ОТОБРАЖЕНИЕМ
    // ======================

    updateTimeDisplay(timeString) {
        if (this.timeDisplay) {
            this.timeDisplay.textContent = timeString;
        }
    }

    showStartButton() {
        this.startButton.classList.remove('hidden');
        this.showInstruction();
    }

    hideStartButton() {
        this.startButton.classList.add('hidden');
        this.hideInstruction();
    }

    showActiveControls() {
        this.activeControls.classList.remove('hidden');
    }

    hideActiveControls() {
        this.activeControls.classList.add('hidden');
    }

    showResetButton() {
        this.resetButton.classList.remove('hidden');
    }

    hideResetButton() {
        this.resetButton.classList.add('hidden');
    }

    showExportButton() {
        this.exportMarkdownBtn.classList.remove('hidden');
    }

    hideExportButton() {
        this.exportMarkdownBtn.classList.add('hidden');
    }

    showInstruction() {
        if (this.instruction) {
            this.instruction.classList.remove('hidden');
        }
    }

    hideInstruction() {
        if (this.instruction) {
            this.instruction.classList.add('hidden');
        }
    }

    // --- Таблица кругов ---
    showLapsTable() {
        this.lapsTableContainer.classList.remove('hidden');
    }

    hideLapsTable() {
        this.lapsTableContainer.classList.add('hidden');
    }

    clearLapsTable() {
        if (this.lapsTableBody) {
            this.lapsTableBody.innerHTML = '';
        }
    }

    addLapRow(lapNumber, lapTime, pauseTime, totalTime) {
        if (!this.lapsTableBody) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${lapNumber}</td>
            <td>${lapTime}</td>
            <td>${pauseTime}</td>
            <td>${totalTime}</td>
        `;
        this.lapsTableBody.appendChild(row);
    }

    // --- Таблица итогов ---
    showSummaryTable() {
        this.summaryTableContainer.classList.remove('hidden');
    }

    hideSummaryTable() {
        this.summaryTableContainer.classList.add('hidden');
    }

    clearSummaryTable() {
        if (this.summaryTableBody) {
            this.summaryTableBody.innerHTML = '';
        }
    }

    addSummaryRow(totalLaps, totalTime, totalPauses, netTime) {
        if (!this.summaryTableBody) return;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${totalLaps}</td>
            <td>${totalTime}</td>
            <td>${totalPauses}</td>
            <td>${netTime}</td>
        `;
        this.summaryTableBody.appendChild(row);
    }

    // ======================
    // ПОДПИСКИ НА СОБЫТИЯ
    // ======================

    onStart(callback) {
        if (this.startButton && callback) {
            this.startButton.addEventListener('click', callback);
        }
    }

    onLap(callback) {
        if (this.lapButton && callback) {
            this.lapButton.addEventListener('click', callback);
        }
    }

    onPauseToggle(callback) {
        if (this.pauseButton && callback) {
            this.pauseButton.addEventListener('click', callback);
        }
    }

    onFinish(callback) {
        if (this.finishButton && callback) {
            this.finishButton.addEventListener('click', callback);
        }
    }

    onReset(callback) {
        if (this.resetButton && callback) {
            this.resetButton.addEventListener('click', callback);
        }
    }

    onToggleLapsTable(callback) {
        if (this.toggleLapsTableBtn && callback) {
            this.toggleLapsTableBtn.addEventListener('click', callback);
        }
    }

    onExportMarkdown(callback) {
        if (this.exportMarkdownBtn && callback) {
            this.exportMarkdownBtn.addEventListener('click', callback);
        }
    }
}
