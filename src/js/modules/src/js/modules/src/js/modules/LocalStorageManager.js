export class LocalStorageManager {
    constructor(key = 'stopwatch_state_v1') {
        this.key = key;
    }

    save(state) {
        try {
            localStorage.setItem(this.key, JSON.stringify(state));
        } catch (e) {
            console.error("Не удалось сохранить состояние:", e);
        }
    }

    load() {
        try {
            const item = localStorage.getItem(this.key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error("Не удалось загрузить состояние:", e);
            return null;
        }
    }

    clear() {
        try {
            localStorage.removeItem(this.key);
        } catch (e) {
            console.error("Не удалось очистить состояние:", e);
        }
    }
}
