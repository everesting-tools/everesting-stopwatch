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
        
        if (!isPaused) {
            // Без паузы - обновляем все
            lapElapsed = now - lapStartTime - currentLapPause;
        } else {
            // Во время паузы - обновляем только общее время и паузу текущего круга
            // Время круга НЕ обновляем (оно замораживается)
            currentLapPause = now - pauseStartTime;
        }
        
        // Общее время всех пауз (для внутренних расчетов)
        totalPauseElapsed = lapsData.reduce((sum, lap) => sum + lap.pauseTime, 0) + currentLapPause;
    }
    
    if (document.getElementById('total-time')) {
        document.getElementById('total-time').textContent = formatTime(totalElapsed);
        document.getElementById('lap-time').textContent = formatTime(lapElapsed);
        // Показываем паузу ТОЛЬКО текущего круга
        document.getElementById('pause-time').textContent = formatTime(currentLapPause);
        
        // Показываем номер текущего круга (0 до старта, затем 1,2,3...)
        const currentLapDisplay = isRunning ? (lapCount + 1) : 0;
        document.getElementById('current-lap').textContent = currentLapDisplay;
    }
}
    
    if (document.getElementById('total-time')) {
        document.getElementById('total-time').textContent = formatTime(totalElapsed);
        document.getElementById('lap-time').textContent = formatTime(lapElapsed);
        document.getElementById('pause-time').textContent = formatTime(totalPauseElapsed);
        
        // Показываем номер текущего круга (0 до старта, затем 1,2,3...)
        const currentLapDisplay = isRunning ? (lapCount + 1) : 0;
        document.getElementById('current-lap').textContent = currentLapDisplay;
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
        lapCount = 0; // Сбрасываем счетчик кругов при новом старте
        
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
        if (instructions && btnInstructions) {
            if (instructions.style.display === 'block') {
                instructions.style.display = 'none';
                btnInstructions.textContent = 'Инструкция';
                btnInstructions.classList.remove('active');
                console.log('✅ Инструкция скрыта при старте');
            }
        }
        
        // Обновление статусов
        document.getElementById('total-status').className = 'status-dot running';
        document.getElementById('lap-status').className = 'status-dot running';
        
        document.getElementById('summary').style.display = 'none';
        
        console.log('✅ Секундомер запущен');
    } else {
        // Фиксация времени круга
        recordLap();
        
        // Сброс времени круга
        lapStartTime = now;
        lapElapsed = 0;
        currentLapPause = 0;
        
        console.log(`✅ Круг ${lapCount} зафиксирован`);
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
        // Включаем паузу
        isPaused = true;
        pauseStartTime = now;
        document.getElementById('pause-status').className = 'status-dot paused';
        console.log('⏸️ Пауза включена');
    } else {
        // Выключаем паузу
        isPaused = false;
        currentLapPause += now - pauseStartTime;
        document.getElementById('pause-status').className = 'status-dot stopped';
        console.log('▶️ Пауза выключена');
    }
    
    hideIndicator('pause');
}

// Функция фиксации круга
function recordLap() {
    const now = Date.now();
    
    const lapTimeWithPause = now - lapStartTime;
    const netLapTime = lapTimeWithPause - currentLapPause;
    
    // Сохраняем данные круга
    const lapData = {
        lapNumber: lapCount + 1,
        lapTime: lapTimeWithPause,
        pauseTime: currentLapPause,
        netTime: netLapTime,
        totalTime: now - startTime,
        timestamp: new Date()
    };
    
    lapsData.push(lapData);
    lapCount++;
    
    console.log(`📊 Круг ${lapCount}: время=${formatTime(lapTimeWithPause)}, пауза=${formatTime(currentLapPause)}, чистое=${formatTime(netLapTime)}`);
    
    // Добавление записи в таблицу
    const resultsBody = document.getElementById('results-body');
    if (resultsBody) {
        const newRow = resultsBody.insertRow();
        newRow.innerHTML = `
            <td>${lapCount}</td>
            <td class="lap-time">${formatTime(lapTimeWithPause)}</td>
            <td class="pause-time">${formatTime(currentLapPause)}</td>
            <td class="net-time">${formatTime(netLapTime)}</td>
            <td class="total-time">${formatTime(now - startTime)}</td>
        `;
        
        // Прокрутка к последней записи если таблица открыта
        const tableContainer = document.getElementById('table-container');
        if (tableContainer && tableContainer.style.display !== 'none') {
            tableContainer.scrollTop = tableContainer.scrollHeight;
        }
    }
}

// Функция остановки всех секундомеров
function finishTimers() {
    isRunning = false;
    isPaused = false;
    
    clearInterval(totalInterval);
    clearInterval(lapInterval);
    clearInterval(pauseInterval);
    
    // Фиксация последнего круга, если таймер был запущен и есть активное время
    if (lapElapsed > 1000) { // Фиксируем только если круг длился больше 1 секунды
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
    
    console.log('🏁 Тренировка завершена');
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
    const resultsBody = document.getElementById('results-body');
    if (resultsBody) {
        resultsBody.innerHTML = '';
    }
    
    // Обновление статусов
    document.getElementById('total-status').className = 'status-dot stopped';
    document.getElementById('lap-status').className = 'status-dot stopped';
    document.getElementById('pause-status').className = 'status-dot stopped';
    
    // Показываем только кнопку пуск
    document.getElementById('btn-start').style.display = 'inline-block';
    document.getElementById('btn-pause').style.display = 'none';
    document.getElementById('btn-finish').style.display = 'none';
    document.getElementById('btn-reset').style.display = 'none';
    
    // Возвращаем текст кнопки
    document.getElementById('btn-start').textContent = 'Пуск';
    
    // Скрытие элементов
    hideAllIndicators();
    document.getElementById('summary').style.display = 'none';
    
    console.log('🔄 Секундомер сброшен');
}

// Функция расчета итогов
function calculateSummary() {
    if (lapsData.length === 0) {
        console.log('❌ Нет данных для итогов');
        return;
    }
    
    const totalTime = lapsData[lapsData.length - 1].totalTime;
    const totalLaps = lapsData.length;
    
    const totalLapTime = lapsData.reduce((sum, lap) => sum + lap.lapTime, 0);
    const avgLapTime = totalLapTime / totalLaps;
    
    const totalNetTime = lapsData.reduce((sum, lap) => sum + lap.netTime, 0);
    const avgNetTime = totalNetTime / totalLaps;
    
    const lapTimes = lapsData.map(lap => lap.lapTime);
    const maxLapTime = Math.max(...lapTimes);
    const minLapTime = Math.min(...lapTimes);
    
    const pauseCount = lapsData.filter(lap => lap.pauseTime > 0).length;
    const totalPauseTime = lapsData.reduce((sum, lap) => sum + lap.pauseTime, 0);
    const netTotalTime = totalTime - totalPauseTime;
    
    // Создаем HTML для итогов
    const summaryContent = document.getElementById('summary-content');
    if (summaryContent) {
        summaryContent.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Общее время:</span>
                <span class="summary-value">${formatTime(totalTime)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Количество кругов:</span>
                <span class="summary-value">${totalLaps}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Среднее время круга:</span>
                <span class="summary-value">${formatTime(avgLapTime)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Среднее чистое время:</span>
                <span class="summary-value">${formatTime(avgNetTime)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Макс. время круга:</span>
                <span class="summary-value">${formatTime(maxLapTime)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Мин. время круга:</span>
                <span class="summary-value">${formatTime(minLapTime)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Количество пауз:</span>
                <span class="summary-value">${pauseCount}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Суммарное время пауз:</span>
                <span class="summary-value">${formatTime(totalPauseTime)}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Чистое общее время:</span>
                <span class="summary-value">${formatTime(netTotalTime)}</span>
            </div>
        `;
    }
    
    document.getElementById('summary').style.display = 'block';
    console.log('✅ Итоги рассчитаны и отображены');
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

// Функция скрытия индикатора (добавлена для полноты)
function hideIndicator(type) {
    const indicator = document.getElementById(`${type}-indicator`);
    if (indicator) {
        indicator.style.display = 'none';
    }
    window[`${type}ClickCount`] = 0;
}
