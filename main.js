// main.js - Инициализация приложения

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Настройка обработчиков кнопок управления
    document.getElementById('btn-start').addEventListener('click', 
        createTripleClickHandler('start', startTimers));
    
    document.getElementById('btn-pause').addEventListener('click', 
        createTripleClickHandler('pause', togglePause));
    
    document.getElementById('btn-finish').addEventListener('click', 
        createTripleClickHandler('finish', finishTimers));
    
    document.getElementById('btn-reset').addEventListener('click', 
        createTripleClickHandler('reset', resetTimers));
    
    // Обработчики верхних кнопок
    document.querySelector('.toggle-table').addEventListener('click', toggleTable);
    document.querySelector('.toggle-instructions').addEventListener('click', toggleInstructions);
    
    // Инициализация
    updateDisplays();
    
    // Скрываем инструкцию и таблицу по умолчанию
    document.querySelector('.instructions').style.display = 'none';
    document.getElementById('table-container').style.display = 'none';
    
    console.log('✅ Секундомер инициализирован');
});
