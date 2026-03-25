// System Logger
export class SystemLogger {
  private logs: Array<{ timestamp: string; level: string; message: string }> = [];

  log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push({ timestamp, level, message });
    
    // Also log to console
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
      `[${timestamp}] ${level.toUpperCase()}: ${message}`
    );

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs.shift();
    }
  }

  getLogs(): Array<{ timestamp: string; level: string; message: string }> {
    return this.logs;
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const systemLogger = new SystemLogger();
