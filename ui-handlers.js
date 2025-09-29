// ui-handlers.js - Обработчики пользовательского интерфейса

// Функция скрытия индикатора
function hideIndicator(type) {
    const indicator = document.getElementById(`${type}-indicator`);
    if (indicator) {
        indicator.style.display = 'none';
    }
    window[`${type}ClickCount`] = 0;
}

// Обработчики тройного нажатия
function createTripleClickHandler(type, actionFunction) {
    return function() {
        // Проверка условий для некоторых кнопок
        if (type === 'pause' && !isRunning) return;
        if (type === 'finish' && !isRunning) return;
        if (type === 'reset' && isRunning) return;
        
        const count = window[`${type}ClickCount`] + 1;
        window[`${type}ClickCount`] = count;
        
        const indicator = document.getElementById(`${type}-indicator`);
        const countDisplay = document.getElementById(`${type}-count`);
        
        if (indicator && countDisplay) {
            indicator.style.display = 'block';
            countDisplay.textContent = 3 - count;
        }
        
        clearTimeout(window[`${type}ClickTimer`]);
        clearTimeout(window[`${type}IndicatorTimeout`]);
        
        if (count >= 3) {
            actionFunction();
            return;
        }
        
        window[`${type}ClickTimer`] = setTimeout(() => {
            window[`${type}ClickCount`] = 0;
            if (indicator) {
                indicator.style.display = 'none';
            }
        }, 1000);
        
        window[`${type}IndicatorTimeout`] = setTimeout(() => {
            if (indicator) {
                indicator.style.display = 'none';
            }
        }, 1000);
    };
}

// Функция переключения таблицы
function toggleTable() {
    const tableContainer = document.getElementById('table-container');
    const btnTable = document.getElementById('btn-table');
    
    if (tableContainer.style.display === 'none') {
        tableContainer.style.display = 'block';
        btnTable.textContent = 'Скрыть таблицу';
        btnTable.classList.add('active');
    } else {
        tableContainer.style.display = 'none';
        btnTable.textContent = 'Таблица';
        btnTable.classList.remove('active');
    }
}
