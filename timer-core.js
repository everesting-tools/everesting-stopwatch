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
        lapElapsed = now - lapStartTime;
        
        if (isPaused) {
            pauseElapsed = now - pauseStartTime;
        }
    }
    
    if (document.getElementById('total-time')) {
        document.getElementById('total-time').textContent = formatTime(totalElapsed);
        document.getElementById('lap-time').textContent = formatTime(lapElapsed);
        document.getElementById('pause-time').textContent = formatTime(pauseElapsed);
    }
}

// Функция запуска секундомеров
function startTimers() {
    const now = Date.now();
    
    if (!isRunning) {
        startTime = now;
        lapStartTime = now;
        isRunning = true;
        
        // Обновление статусов
        document.getElementById('total-status').className = 'status-dot running';
        document.getElementById('lap-status').className = 'status-dot running';
        
        // Активация кнопок
        document.getElementById('btn-pause').disabled = false;
        document.getElementById('btn-finish').disabled = false;
        document.getElementById('btn-reset').disabled = false;
        document.getElementById('btn-start').textContent = 'Круг';
        document.getElementById('btn-start').classList.add('active');
        document.getElementById('btn-pause').classList.add('active');
        
        document.getElementById('summary').style.display = 'none';
    } else {
        recordLap();
        lapStartTime = now;
        lapElapsed = 0;
        pauseElapsed = 0;
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
        pauseElapsed += now - pauseStartTime;
        document.getElementById('pause-status').className = 'status-dot stopped';
    }
    
    hideIndicator('pause');
}

// Функция фиксации круга
function recordLap() {
    const now = Date.now();
    lapCount++;
    
    const lapTimeWithPause = now - lapStartTime;
    const netLapTime = lapTimeWithPause - pauseElapsed;
    
    // Сохраняем данные круга
    const lapData = {
        lapNumber: lapCount,
        lapTime: lapTimeWithPause,
        pauseTime: pauseElapsed,
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
        <td class="pause-time">${formatTime(pauseElapsed)}</td>
        <td class="net-time">${formatTime(netLapTime)}</td>
        <td class="total-time">${formatTime(now - startTime)}</td>
    `;
    
    // Прокрутка к последней записи
    document.getElementById('results-body').parentElement.scrollTop = 
        document.getElementById('results-body').parentElement.scrollHeight;
}

// Функция остановки всех секундомеров
function finishTimers() {
    isRunning = false;
    isPaused = false;
    
    clearInterval(totalInterval);
    clearInterval(lapInterval);
    clearInterval(pauseInterval);
    clearTimeout(finishClickTimer);
    clearTimeout(finishIndicatorTimeout);
    
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
    
    // Блокировка кнопок
    document.getElementById('btn-start').disabled = true;
    document.getElementById('btn-pause').disabled = true;
    document.getElementById('btn-finish').disabled = true;
    document.getElementById('btn-reset').disabled = false;
    
    // Сброс текста кнопок
    document.getElementById('btn-start').textContent = 'Пуск/круг';
    document.getElementById('btn-start').classList.remove('active');
    document.getElementById('btn-pause').classList.remove('active');
    
    hideIndicator('finish');
}

// Функция сброса
function resetTimers() {
    clearInterval(totalInterval);
    clearInterval(lapInterval);
    clearInterval(pauseInterval);
    clearTimeout(startClickTimer);
    clearTimeout(startIndicatorTimeout);
    clearTimeout(pauseClickTimer);
    clearTimeout(pauseIndicatorTimeout);
    clearTimeout(finishClickTimer);
    clearTimeout(finishIndicatorTimeout);
    clearTimeout(resetClickTimer);
    clearTimeout(resetIndicatorTimeout);
    
    // Сброс переменных
    startTime = 0;
    lapStartTime = 0;
    pauseStartTime = 0;
    totalElapsed = 0;
    lapElapsed = 0;
    pauseElapsed = 0;
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
    
    // Блокировка кнопок
    document.getElementById('btn-start').disabled = false;
    document.getElementById('btn-pause').disabled = true;
    document.getElementById('btn-finish').disabled = true;
    document.getElementById('btn-reset').disabled = true;
    
    // Сброс текста и стилей кнопок
    document.getElementById('btn-start').textContent = 'Пуск/круг';
    document.getElementById('btn-start').classList.remove('active');
    document.getElementById('btn-pause').classList.remove('active');
    document.getElementById('btn-table').textContent = 'Таблица';
    document.getElementById('btn-table').classList.remove('active');
    
    // Скрытие элементов
    hideIndicator('start');
    hideIndicator('pause');
    hideIndicator('finish');
    hideIndicator('reset');
    document.getElementById('summary').style.display = 'none';
    document.getElementById('table-container').style.display = 'none';
}

// Функция расчета итогов
// timer-core.js - Добавьте в начало функции calculateSummary()
function calculateSummary() {
    if (lapsData.length === 0) {
        console.log('❌ Нет данных для итогов');
        return;
    }
    
    // Создаем HTML для итогов если его нет
    const summaryContent = document.getElementById('summary-content');
    if (!summaryContent.innerHTML.trim()) {
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Общее время:</span>
                <span class="summary-value" id="summary-total-time">00:00:00</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Количество кругов:</span>
                <span class="summary-value" id="summary-lap-count">0</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Среднее время круга:</span>
                <span class="summary-value" id="summary-avg-lap">00:00:00</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Среднее чистое время:</span>
                <span class="summary-value" id="summary-avg-net">00:00:00</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Макс. время круга:</span>
                <span class="summary-value" id="summary-max-lap">00:00:00</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Мин. время круга:</span>
                <span class="summary-value" id="summary-min-lap">00:00:00</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Количество пауз:</span>
                <span class="summary-value" id="summary-pause-count">0</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Суммарное время пауз:</span>
                <span class="summary-value" id="summary-total-pause">00:00:00</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Чистое общее время:</span>
                <span class="summary-value" id="summary-net-total">00:00:00</span>
            </div>
        `;
    }
    
    // ... остальной код расчета
    console.log('✅ Итоги рассчитаны и отображены');
}
