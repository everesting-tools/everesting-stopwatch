// main.js - Инициализация приложения

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Настройка обработчиков кнопок
    document.getElementById('btn-start').addEventListener('click', 
        createTripleClickHandler('start', startTimers));
    
    document.getElementById('btn-pause').addEventListener('click', 
        createTripleClickHandler('pause', togglePause));
    
    document.getElementById('btn-finish').addEventListener('click', 
        createTripleClickHandler('finish', finishTimers));
    
    document.getElementById('btn-reset').addEventListener('click', 
        createTripleClickHandler('reset', resetTimers));
    
    document.getElementById('btn-table').addEventListener('click', toggleTable);
    
    // Обработчик инструкции
    document.querySelector('.toggle-instructions').addEventListener('click', function() {
        document.querySelector('.instructions').classList.toggle('hidden');
    });
    
    // Инициализация
    updateDisplays();
    document.querySelector('.instructions').classList.add('hidden');
    
    console.log('✅ Секундомер инициализирован в модульном режиме');
});
