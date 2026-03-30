// logger do sistema
export class SystemLogger {
    constructor() {
        this.logs = [];
    }
    log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({ timestamp, level, message });
        // também regista na consola
        console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        // mantém apenas os últimos 100 registos
        if (this.logs.length > 100) {
            this.logs.shift();
        }
    }
    getLogs() {
        return this.logs;
    }
    clearLogs() {
        this.logs = [];
    }
}
export const systemLogger = new SystemLogger();
//# sourceMappingURL=SystemLogger.js.map