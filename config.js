// config.js - Конфигурация и глобальные переменные

// Переменные для хранения времени
let startTime = 0;
let lapStartTime = 0;
let pauseStartTime = 0;
let totalElapsed = 0;
let lapElapsed = 0;
let currentLapPause = 0;   // Пауза в текущем круге (показывается в дисплее)
let totalPauseElapsed = 0; // Общее время всех пауз (только для внутренних расчетов)
let isRunning = false;
let isPaused = false;
let lapCount = 0;

// Массивы данных
let lapsData = [];
let actionLogs = [];

// Переменные для интервалов
let totalInterval;
let lapInterval;
let pauseInterval;

// Переменные для тройного нажатия
let startClickCount = 0;
let startClickTimer;
let startIndicatorTimeout;

let pauseClickCount = 0;
let pauseClickTimer;
let pauseIndicatorTimeout;

let finishClickCount = 0;
let finishClickTimer;
let finishIndicatorTimeout;

let resetClickCount = 0;
let resetClickTimer;
let resetIndicatorTimeout;
