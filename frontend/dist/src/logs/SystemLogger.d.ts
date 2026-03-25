export declare class SystemLogger {
    private logs;
    log(message: string, level?: 'info' | 'warn' | 'error'): void;
    getLogs(): Array<{
        timestamp: string;
        level: string;
        message: string;
    }>;
    clearLogs(): void;
}
export declare const systemLogger: SystemLogger;
//# sourceMappingURL=SystemLogger.d.ts.map