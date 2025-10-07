// src/js/UIController.js

export class UIController {
    constructor() {
        console.log("🔧 UIController: инициализация...");

        // Элементы интерфейса
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('start');
        this.lapButton = document.getElementById('lap');
        this.pauseButton = document.getElementById('pause');
        this.finishButton = document.getElementById('finish');
        this.resetButton = document.getElementById('reset');
        this.activeControls = document.getElementById('activeControls');
        this.toggleInstructionBtn = document.getElementById('toggleInstruction');
        this.instruction = document.getElementById('instruction');
        this.toggleTableBtn = document.getElementById('toggleTable');
        this.closeTableBtn = document.getElementById('closeTable');
        this.mainContent = document.getElementById('mainContent');
        this.sidebar = document.getElementById('sidebar');
        this.lapsTableBody = document.getElementById('lapsTableBody');
        this.toggleSettingsBtn = document.getElementById('toggleSettings');
        this.closeSettingsBtn = document.getElementById('closeSettings');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.themeToggle = document.getElementById('themeToggle');
        this.languageToggle = document.getElementById('languageToggle');
        this.activePanel = null; // ← Новое: null | 'instruction' | 'table' | 'settings'
        
        
        

        // Проверка элементов
        const elements = [
            { name: 'time', el: this.timeDisplay },
            { name: 'start', el: this.startButton },
            { name: 'lap', el: this.lapButton },
            { name: 'pause', el: this.pauseButton },
            { name: 'finish', el: this.finishButton },
            { name: 'reset', el: this.resetButton },
            { name: 'activeControls', el: this.activeControls },
            { name: 'toggleInstruction', el: this.toggleInstructionBtn },
            { name: 'instruction', el: this.instruction },
            { name: 'toggleTable', el: this.toggleTableBtn },
            { name: 'closeTable', el: this.closeTableBtn },
            { name: 'mainContent', el: this.mainContent },
            { name: 'sidebar', el: this.sidebar },
            { name: 'lapsTableBody', el: this.lapsTableBody },
            { name: 'toggleSettings', el: this.toggleSettingsBtn },
            { name: 'closeSettings', el: this.closeSettingsBtn },
            { name: 'settingsPanel', el: this.settingsPanel }
        ];

        for (const { name, el } of elements) {
            if (!el) {
                console.error(`❌ UIController: Элемент #${name} не найден!`);
            }
        }

        // Привязка событий для инструкции
        if (this.toggleInstructionBtn) {
            this.toggleInstructionBtn.addEventListener('click', () => {
                if (this.instruction.classList.contains('hidden')) {
                    console.log("📖 Инструкция: показать");
                    this.showInstruction();
                } else {
                    console.log("📖 Инструкция: скрыть");
                    this.hideInstruction();
                }
            });
        }

        // Привязка событий для таблицы
        if (this.toggleTableBtn) {
            this.toggleTableBtn.addEventListener('click', () => {
                this.toggleTable();
            });
        }

        if (this.closeTableBtn) {
            this.closeTableBtn.addEventListener('click', () => {
                this.toggleTable();
            });
        }


        // Привязка событий для настроек
        if (this.toggleSettingsBtn) {
            this.toggleSettingsBtn.addEventListener('click', () => {
            this.toggleSettings();
            });
        }

        if (this.closeSettingsBtn) {
            this.closeSettingsBtn.addEventListener('click', () => {
                this.toggleSettings();
            });
        }
        
        if (this.themeToggle) {
            this.themeToggle.addEventListener('change', () => {
            this.applyTheme(this.themeToggle.checked);
            });
        }

        if (this.languageToggle) {
            this.languageToggle.addEventListener('change', () => {
            this.applyLanguage(this.languageToggle.checked);
            });
}
    }

    // ================
    // УПРАВЛЕНИЕ ВИДИМОСТЬЮ
    // ================

    updateTimeDisplay(text) {
        if (this.timeDisplay) {
            this.timeDisplay.textContent = text;
        }
    }

    showStartButton() {
        if (this.startButton) {
            this.startButton.classList.remove('hidden');
        }
    }

    hideStartButton() {
        if (this.startButton) {
            this.startButton.classList.add('hidden');
        }
    }

    showActiveControls() {
        if (this.activeControls) {
            this.activeControls.classList.remove('hidden');
        }
    }

    hideActiveControls() {
        if (this.activeControls) {
            this.activeControls.classList.add('hidden');
        }
    }

    showResetButton() {
        if (this.resetButton) {
            this.resetButton.classList.remove('hidden');
        }
    }

    hideResetButton() {
        if (this.resetButton) {
            this.resetButton.classList.add('hidden');
        }
    }



    showInstruction() {
    // Закрываем другие панели
    this.closeOtherPanels('instruction');

    if (this.instruction) {
        this.instruction.classList.remove('hidden');
    }
    this.hideStartButton(); // Скрываем "Старт" всегда
    this.activePanel = 'instruction';
}



    hideInstruction() {
    if (this.instruction) {
        this.instruction.classList.add('hidden');
    }

    // Восстанавливаем предыдущее состояние
    if (this.activePanel === 'instruction') {
        this.activePanel = null;
        if (this.currentState === 'initial') {
            this.showStartButton();
        }
    }
}
    

    showTime() {
        if (this.timeDisplay) {
            this.timeDisplay.classList.remove('hidden');
        }
    }

    hideTime() {
        if (this.timeDisplay) {
            this.timeDisplay.classList.add('hidden');
        }
    }

    // Метод для обновления состояния (из Stopwatch)
    updateState(state) {
        this.currentState = state;
    }

    // Переключение таблицы
    toggleTable() {
    if (this.sidebar.classList.contains('open')) {
        this.sidebar.classList.remove('open');
        this.mainContent.classList.remove('shifted-table');
        this.activePanel = null;
    } else {
        this.closeOtherPanels('table');
        this.sidebar.classList.add('open');
        this.mainContent.classList.add('shifted-table');
        this.activePanel = 'table';
    }
}
    
    

    // Переключение настроек
    toggleSettings() {
    if (this.settingsPanel.classList.contains('open')) {
        this.settingsPanel.classList.remove('open');
        this.mainContent.classList.remove('shifted-settings');
        this.activePanel = null;
    } else {
        this.closeOtherPanels('settings');
        this.settingsPanel.classList.add('open');
        this.mainContent.classList.add('shifted-settings');
        this.activePanel = 'settings';
    }
}
    
    
    closeOtherPanels(except) {
    // Закрываем инструкцию
    if (this.activePanel === 'instruction' && except !== 'instruction') {
        this.hideInstruction();
    }

    // Закрываем таблицу
    if (this.activePanel === 'table' && except !== 'table') {
        this.sidebar.classList.remove('open');
        this.mainContent.classList.remove('shifted-table');
    }

    // Закрываем настройки
    if (this.activePanel === 'settings' && except !== 'settings') {
        this.settingsPanel.classList.remove('open');
        this.mainContent.classList.remove('shifted-settings');
    }
}
    
    

    // ================
    // ПРИВЯЗКА СОБЫТИЙ
    // ================

    bindStart(callback) {
        if (this.startButton && typeof callback === 'function') {
            this.startButton.addEventListener('click', callback);
            console.log("✅ UIController: обработчик Start привязан");
        }
    }

    bindLap(callback) {
        if (this.lapButton && typeof callback === 'function') {
            this.lapButton.addEventListener('click', callback);
            console.log("✅ UIController: обработчик Lap привязан");
        }
    }

    bindPause(callback) {
        if (this.pauseButton && typeof callback === 'function') {
            this.pauseButton.addEventListener('click', callback);
            console.log("✅ UIController: обработчик Pause привязан");
        }
    }

    bindFinish(callback) {
        if (this.finishButton && typeof callback === 'function') {
            this.finishButton.addEventListener('click', callback);
            console.log("✅ UIController: обработчик Finish привязан");
        }
    }

    bindReset(callback) {
        if (this.resetButton && typeof callback === 'function') {
            this.resetButton.addEventListener('click', callback);
            console.log("✅ UIController: обработчик Reset привязан");
        }
    }

    // Методы для таблицы
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

    clearLapsTable() {
        if (this.lapsTableBody) {
            this.lapsTableBody.innerHTML = '';
        }
    }
    
    applyTheme(isDark) {
        if (isDark) {
        document.body.classList.add('dark-theme');
        } else {
        document.body.classList.remove('dark-theme');
        }
    }

    applyLanguage(isEnglish) {
    // Обновляем текст заголовка
    const title = document.querySelector('.title');
    if (title) {
        title.textContent = isEnglish ? "Everesting Stopwatch" : "Секундомер для Everesting";
    }

    // Обновляем текст кнопок
    if (this.startButton) this.startButton.textContent = isEnglish ? "START" : "СТАРТ";
    if (this.lapButton) this.lapButton.textContent = isEnglish ? "LAP" : "КРУГ";
    if (this.pauseButton) this.pauseButton.textContent = isEnglish ? "PAUSE" : "ПАУЗА";
    if (this.finishButton) this.finishButton.textContent = isEnglish ? "FINISH" : "ФИНИШ";
    if (this.resetButton) this.resetButton.textContent = isEnglish ? "RESET" : "СБРОС";

    // Обновляем метки в настройках
    const themeLabel = document.querySelector('.theme-label');
    if (themeLabel) {
        themeLabel.textContent = isEnglish ? "Theme / Тема" : "Тема / Theme";
    }

    const languageLabel = document.querySelector('.language-label');
    if (languageLabel) {
        languageLabel.textContent = isEnglish ? "Language / Язык" : "Язык / Language";
    }
}
}