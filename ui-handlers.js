// ui-handlers.js - Обработчики пользовательского интерфейса

// Функция скрытия индикатора
function hideIndicator(type) {
    const indicator = document.getElementById(`${type}-indicator`);
    if (indicator) {
        indicator.style.display = 'none';
    }
    if (window[`${type}ClickCount`] !== undefined) {
        window[`${type}ClickCount`] = 0;
    }
}

// Функция переключения таблицы
function toggleTable() {
    const tableContainer = document.getElementById('table-container');
    const btnTable = document.querySelector('.toggle-table');
    
    if (!tableContainer || !btnTable) {
        console.error('❌ Элементы таблицы не найдены');
        return;
    }
    
    if (tableContainer.style.display === 'none' || !tableContainer.style.display) {
        tableContainer.style.display = 'block';
        btnTable.textContent = 'Скрыть таблицу';
        btnTable.classList.add('active');
        console.log('✅ Таблица показана');
    } else {
        tableContainer.style.display = 'none';
        btnTable.textContent = 'Таблица';
        btnTable.classList.remove('active');
        console.log('✅ Таблица скрыта');
    }
}

// Функция переключения инструкции
function toggleInstructions() {
    const instructions = document.querySelector('.instructions');
    const btnInstructions = document.querySelector('.toggle-instructions');
    
    if (!instructions || !btnInstructions) {
        console.error('❌ Элементы инструкции не найдены');
        return;
    }
    
    if (instructions.style.display === 'none' || !instructions.style.display) {
        instructions.style.display = 'block';
        btnInstructions.textContent = 'Скрыть инструкцию';
        btnInstructions.classList.add('active');
        console.log('✅ Инструкция показана');
    } else {
        instructions.style.display = 'none';
        btnInstructions.textContent = 'Инструкция';
        btnInstructions.classList.remove('active');
        console.log('✅ Инструкция скрыта');
    }
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
