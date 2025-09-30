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

// Функция переключения инструкции
function toggleInstructions() {
    const instructions = document.querySelector('.instructions');
    const btnInstructions = document.querySelector('.toggle-instructions');
    
    if (instructions.style.display === 'none' || !instructions.style.display) {
        instructions.style.display = 'block';
        btnInstructions.textContent = 'Скрыть инструкцию';
        btnInstructions.classList.add('active');
    } else {
        instructions.style.display = 'none';
        btnInstructions.textContent = 'Инструкция';
        btnInstructions.classList.remove('active');
    }
}
