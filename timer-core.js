// timer-core.js - Основная логика таймера

// Функция форматирования времени в чч:мм:сс
function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Функция обновления дисплеев времени
function updateDisplays() {
    const now = Date.now();
    
    if (isRunning) {
        totalElapsed = now - startTime;
        lapElapsed = now - lapStartTime - currentLapPause;
        
        if (isPaused) {
            currentLapPause = now - pauseStartTime;
        }
        
        // Обновляем суммарное время пауз
        totalPauseElapsed = lapsData.reduce((sum, lap) => sum + lap.pauseTime, 0) + currentLapPause;
    }
    
    if (document.getElementById('total-time')) {
        document.getElementById('total-time').textContent = formatTime(totalElapsed);
        document.getElementById('lap-time').textContent = formatTime(lapElapsed);
        document.getElementById('pause-time').textContent = formatTime(totalPauseElapsed);
        document.getElementById('current-lap').textContent = lapCount + 1;
    }
}

// Функция запуска секундомеров
function startTimers() {
    const now = Date.now();
    
    if (!isRunning) {
        // Первый запуск
        startTime = now;
        lapStartTime = now;
        isRunning = true;
        lapCount = 0;

// Скрываем инструкцию при старте
const instructions = document.querySelector('.instructions');
const btnInstructions = document.querySelector('.toggle-instructions');
if (instructions.style.display === 'block') {
    instructions.style.display = 'none';
    btnInstructions.textContent = 'Инструкция';
    btnInstructions.classList.remove('active');
}
        
        // Показываем только нужные кнопки
        document.getElementById('btn-start').style.display = 'inline-block';
        document.getElementById('btn-pause').style.display = 'inline-block';
        document.getElementById('btn-finish').style.display = 'inline-block';
        document.getElementById('btn-reset').style.display = 'none';
        
        // Меняем текст кнопки
        document.getElementById('btn-start').textContent = 'Круг';
        
        // Скрываем инструкцию при старте
        const instructions = document.querySelector('.instructions');
        const btnInstructions = document.querySelector('.toggle-instructions');
        if (instructions.style.display === 'block') {
            instructions.style.display = 'none';
            btnInstructions.textContent = 'Инструкция';
            btnInstructions.classList.remove('active');
        }
        
        // Обновление статусов
        document.getElementById('total-status').className = 'status-dot running';
        document.getElementById('lap-status').className = 'status-dot running';
        
        document.getElementById('summary').style.display = 'none';
    } else {
        // Фиксация времени круга
        recordLap();
        
        // Сброс времени круга
        lapStartTime = now;
        lapElapsed = 0;
        currentLapPause = 0;
    }
    
    clearInterval(totalInterval);
    clearInterval(lapInterval);
    totalInterval = setInterval(updateDisplays, 100);
    lapInterval = setInterval(updateDisplays, 100);
    
    hideIndicator('start');
}

// Функция паузы/возобновления
function togglePause() {
    const now = Date.now();
    
    if (!isPaused) {
        isPaused = true;
        pauseStartTime = now;
        document.getElementById('pause-status').className = 'status-dot paused';
    } else {
        isPaused = false;
        currentLapPause += now - pauseStartTime;
        document.getElementById('pause-status').className = 'status-dot stopped';
    }
    
    hideIndicator('pause');
}

// Функция фиксации круга
function recordLap() {
    const now = Date.now();
    lapCount++;
    
    const lapTimeWithPause = now - lapStartTime;
    const netLapTime = lapTimeWithPause - currentLapPause;
    
    // Сохраняем данные круга
    const lapData = {
        lapNumber: lapCount,
        lapTime: lapTimeWithPause,
        pauseTime: currentLapPause,
        netTime: netLapTime,
        totalTime: now - startTime,
        timestamp: new Date()
    };
    
    lapsData.push(lapData);
    
    // Добавление записи в таблицу
    const newRow = document.getElementById('results-body').insertRow();
    newRow.innerHTML = `
        <td>${lapCount}</td>
        <td class="lap-time">${formatTime(lapTimeWithPause)}</td>
        <td class="pause-time">${formatTime(currentLapPause)}</td>
        <td class="net-time">${formatTime(netLapTime)}</td>
        <td class="total-time">${formatTime(now - startTime)}</td>
    `;
}

// Функция остановки всех секундомеров
function finishTimers() {
    isRunning = false;
    isPaused = false;
    
    clearInterval(totalInterval);
    clearInterval(lapInterval);
    clearInterval(pauseInterval);
    
    // Фиксация последнего круга
    if (lapCount > 0 && lapElapsed > 0) {
        recordLap();
    }
    
    // Расчет и отображение итогов
    calculateSummary();
    
    // Обновление статусов
    document.getElementById('total-status').className = 'status-dot stopped';
    document.getElementById('lap-status').className = 'status-dot stopped';
    document.getElementById('pause-status').className = 'status-dot stopped';
    
    // Показываем только кнопку сброса
    document.getElementById('btn-start').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-finish').style.display = 'none';
    document.getElementById('btn-reset').style.display = 'inline-block';
    
    hideIndicator('finish');
}

// Функция сброса
function resetTimers() {
    clearInterval(totalInterval);
    clearInterval(lapInterval);
    clearInterval(pauseInterval);
    clearAllTimeouts();
    
    // Сброс переменных
    startTime = 0;
    lapStartTime = 0;
    pauseStartTime = 0;
    totalElapsed = 0;
    lapElapsed = 0;
    totalPauseElapsed = 0;
    currentLapPause = 0;
    isRunning = false;
    isPaused = false;
    lapCount = 0;
    startClickCount = 0;
    pauseClickCount = 0;
    finishClickCount = 0;
    resetClickCount = 0;
    lapsData = [];
    
    updateDisplays();
    
    // Очистка таблицы
    document.getElementById('results-body').innerHTML = '';
    
    // Обновление статусов
    document.getElementById('total-status').className = 'status-dot stopped';
    document.getElementById('lap-status').className = 'status-dot stopped';
    document.getElementById('pause-status').className = 'status-dot stopped';
    
    // Показываем только кнопку пуск
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-finish').style.display = 'none';
    document.getElementById('btn-reset').style.display = 'none';
    
    // Скрытие элементов
    hideAllIndicators();
    document.getElementById('summary').style.display = 'none';
}

// Функция очистки всех таймеров
function clearAllTimeouts() {
    clearTimeout(startClickTimer);
    clearTimeout(startIndicatorTimeout);
    clearTimeout(pauseClickTimer);
    clearTimeout(pauseIndicatorTimeout);
    clearTimeout(finishClickTimer);
    clearTimeout(finishIndicatorTimeout);
    clearTimeout(resetClickTimer);
    clearTimeout(resetIndicatorTimeout);
}

// Функция скрытия всех индикаторов
function hideAllIndicators() {
    hideIndicator('start');
    hideIndicator('pause');
    hideIndicator('finish');
    hideIndicator('reset');
        }
