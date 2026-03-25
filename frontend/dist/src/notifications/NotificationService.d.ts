export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
}
export declare class NotificationService {
    private notifications;
    private listeners;
    show(message: string, type?: 'success' | 'error' | 'info' | 'warning', duration?: number): void;
    remove(id: string): void;
    subscribe(callback: (notifications: Notification[]) => void): void;
    private notifyListeners;
}
export declare const notificationService: NotificationService;
//# sourceMappingURL=NotificationService.d.ts.map