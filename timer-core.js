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
function calculateSummary() {
    if (lapsData.length === 0) return;
    
    const totalTime = lapsData[lapsData.length - 1].totalTime;
    const lapCount = lapsData.length;
    
    const totalLapTime = lapsData.reduce((sum, lap) => sum + lap.lapTime, 0);
    const avgLapTime = totalLapTime / lapCount;
    
    const totalNetTime = lapsData.reduce((sum, lap) => sum + lap.netTime, 0);
    const avgNetTime = totalNetTime / lapCount;
    
    const lapTimes = lapsData.map(lap => lap.lapTime);
    const maxLapTime = Math.max(...lapTimes);
    const minLapTime = Math.min(...lapTimes);
    
    const pauseCount = lapsData.filter(lap => lap.pauseTime > 0).length;
    const totalPauseTime = lapsData.reduce((sum, lap) => sum + lap.pauseTime, 0);
    const netTotalTime = totalTime - totalPauseTime;
    
    // Обновляем элементы итогов
    document.getElementById('summary-total-time').textContent = formatTime(totalTime);
    document.getElementById('summary-lap-count').textContent = lapCount;
    document.getElementById('summary-avg-lap').textContent = formatTime(avgLapTime);
    document.getElementById('summary-avg-net').textContent = formatTime(avgNetTime);
    document.getElementById('summary-max-lap').textContent = formatTime(maxLapTime);
    document.getElementById('summary-min-lap').textContent = formatTime(minLapTime);
    document.getElementById('summary-pause-count').textContent = pauseCount;
    document.getElementById('summary-total-pause').textContent = formatTime(totalPauseTime);
    document.getElementById('summary-net-total').textContent = formatTime(netTotalTime);
    
    document.getElementById('summary').style.display = 'block';
      }
