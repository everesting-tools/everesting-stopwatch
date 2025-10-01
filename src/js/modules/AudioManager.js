// src/js/modules/AudioManager.js

export class AudioManager {
    constructor() {
        // Создаём аудио-контекст (браузер может требовать жест взаимодействия)
        this.audioContext = null;
        this.isInitialized = false;
    }

    init() {
        if (this.isInitialized) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
        } catch (e) {
            console.warn("Web Audio API не поддерживается");
        }
    }

    playTone(frequency, duration, volume = 0.1, type = 'sine') {
        if (!this.isInitialized) this.init();
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        gainNode.gain.value = volume;

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
        }, duration);
    }

    playStartupBeeps() {
        this.init();
        let delay = 0;
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.playTone(800, 300, 0.1, 'square');
            }, delay);
            delay += 1000; // 1 сек между гудками
        }
        setTimeout(() => {
            // После третьего гудка — старт таймера (вызовем через callback)
            if (this.onStartupComplete) {
                this.onStartupComplete();
            }
        }, delay);
    }

    playLapSound() {
        this.init();
        let delay = 0;
        [600, 800, 1000].forEach(freq => {
            setTimeout(() => {
                this.playTone(freq, 150, 0.1, 'sine');
            }, delay);
            delay += 200;
        });
    }

    playPauseSound() {
        this.init();
        this.playTone(400, 500, 0.1, 'triangle');
    }

    playFinishSound() {
        this.init();
        let delay = 0;
        [523, 659, 784, 1046].forEach(freq => { // до-ми-соль-до (C4-E4-G4-C5)
            setTimeout(() => {
                this.playTone(freq, 150, 0.15, 'sine');
            }, delay);
            delay += 200;
        });
    }

    playResetSound() {
        this.init();
        const startTime = this.audioContext.currentTime;
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, startTime + 0.5);

        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.5);
    }
              }
