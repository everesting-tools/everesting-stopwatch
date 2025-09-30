// main.js - Инициализация приложения

// main.js - Добавьте в начало
console.log('🔧 Загружен main.js');

// Проверка что все модули загружены
if (typeof formatTime === 'undefined') {
    console.error('❌ timer-core.js не загружен');
}
if (typeof createTripleClickHandler === 'undefined') {
    console.error('❌ ui-handlers.js не загружен');
}
if (typeof startTime === 'undefined') {
    console.error('❌ config.js не загружен');
}

console.log('✅ Все модули загружены');

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
