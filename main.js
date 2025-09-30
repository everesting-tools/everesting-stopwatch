// main.js - Инициализация приложения

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Инициализация секундомера...');
    
    // Проверка загрузки модулей
    if (typeof createTripleClickHandler === 'undefined') {
        console.error('❌ ui-handlers.js не загружен');
        alert('Ошибка: ui-handlers.js не загружен');
        return;
    }
    if (typeof startTimers === 'undefined') {
        console.error('❌ timer-core.js не загружен');
        alert('Ошибка: timer-core.js не загружен');
        return;
    }
    if (typeof isRunning === 'undefined') {
        console.error('❌ config.js не загружен');
        alert('Ошибка: config.js не загружен');
        return;
    }
    
    console.log('✅ Все модули загружены');
    
    // Настройка обработчиков кнопок управления
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnFinish = document.getElementById('btn-finish');
    const btnReset = document.getElementById('btn-reset');
    
    if (btnStart) {
        // Пуск - одним нажатием
        btnStart.addEventListener('click', function() {
            console.log('🟢 Нажата кнопка Пуск/Круг');
            if (!isRunning) {
                // Первое нажатие - запуск
                console.log('🚀 Запуск секундомера');
                startTimers();
            } else {
                // Последующие нажатия - круг (тройное нажатие)
                console.log('⭕ Фиксация круга (тройное нажатие)');
                createTripleClickHandler('start', startTimers)();
            }
        });
        console.log('✅ Обработчик Пуск установлен');
    } else {
        console.error('❌ Кнопка Пуск не найдена');
    }
    
    if (btnPause) {
        btnPause.addEventListener('click', createTripleClickHandler('pause', togglePause));
        console.log('✅ Обработчик Пауза установлен');
    } else {
        console.error('❌ Кнопка Пауза не найдена');
    }
    
    if (btnFinish) {
        btnFinish.addEventListener('click', createTripleClickHandler('finish', finishTimers));
        console.log('✅ Обработчик Финиш установлен');
    } else {
        console.error('❌ Кнопка Финиш не найдена');
    }
    
    if (btnReset) {
        btnReset.addEventListener('click', createTripleClickHandler('reset', resetTimers));
        console.log('✅ Обработчик Сброс установлен');
    } else {
        console.error('❌ Кнопка Сброс не найдена');
    }
    
    // Обработчики верхних кнопок
    const btnTable = document.querySelector('.toggle-table');
    const btnInstructions = document.querySelector('.toggle-instructions');
    
    if (btnTable) {
        btnTable.addEventListener('click', toggleTable);
        console.log('✅ Обработчик Таблица установлен');
    } else {
        console.error('❌ Кнопка Таблица не найдена');
    }
    
    if (btnInstructions) {
        btnInstructions.addEventListener('click', toggleInstructions);
        console.log('✅ Обработчик Инструкция установлен');
    } else {
        console.error('❌ Кнопка Инструкция не найдена');
    }
    
    // Инициализация
    updateDisplays();
    
    // Скрываем инструкцию и таблицу по умолчанию
    const instructions = document.querySelector('.instructions');
    const tableContainer = document.getElementById('table-container');
    
    if (instructions) {
        instructions.style.display = 'none';
        console.log('✅ Инструкция скрыта');
    }
    
    if (tableContainer) {
        tableContainer.style.display = 'none';
        console.log('✅ Таблица скрыта');
    }
    
    console.log('✅ Секундомер полностью инициализирован');
});
