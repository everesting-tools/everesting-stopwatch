// main.js - Инициализация приложения

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Инициализация секундомера...');
    
    // Проверка загрузки модулей
    if (typeof createTripleClickHandler === 'undefined') {
        console.error('❌ ui-handlers.js не загружен');
        return;
    }
    if (typeof startTimers === 'undefined') {
        console.error('❌ timer-core.js не загружен');
        return;
    }
    
    // Настройка обработчиков кнопок управления
    const btnStart = document.getElementById('btn-start');
    const btnPause = document.getElementById('btn-pause');
    const btnFinish = document.getElementById('btn-finish');
    const btnReset = document.getElementById('btn-reset');
    
    if (btnStart) {
        btnStart.addEventListener('click', createTripleClickHandler('start', startTimers));
        console.log('✅ Обработчик Пуск установлен');
    }
    
    if (btnPause) {
        btnPause.addEventListener('click', createTripleClickHandler('pause', togglePause));
        console.log('✅ Обработчик Пауза установлен');
    }
    
    if (btnFinish) {
        btnFinish.addEventListener('click', createTripleClickHandler('finish', finishTimers));
        console.log('✅ Обработчик Финиш установлен');
    }
    
    if (btnReset) {
        btnReset.addEventListener('click', createTripleClickHandler('reset', resetTimers));
        console.log('✅ Обработчик Сброс установлен');
    }
    
    // Обработчики верхних кнопок
    const btnTable = document.querySelector('.toggle-table');
    const btnInstructions = document.querySelector('.toggle-instructions');
    
    if (btnTable) {
        btnTable.addEventListener('click', toggleTable);
        console.log('✅ Обработчик Таблица установлен');
    }
    
    if (btnInstructions) {
        btnInstructions.addEventListener('click', toggleInstructions);
        console.log('✅ Обработчик Инструкция установлен');
    }
    
    // Инициализация
    updateDisplays();
    
    // Скрываем инструкцию и таблицу по умолчанию
    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('table-container').style.display = 'none';
    
    console.log('✅ Секундомер инициализирован');
});
