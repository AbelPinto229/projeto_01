// System Logger
export class SystemLogger {
    constructor() {
        this.logs = [];
    }
    log(message, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        this.logs.push({ timestamp, level, message });
        // Also log to console
        console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`[${timestamp}] ${level.toUpperCase()}: ${message}`);
        // Keep only last 100 logs
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