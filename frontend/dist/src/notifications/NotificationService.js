// Notification Service
export class NotificationService {
    constructor() {
        this.notifications = new Map();
        this.listeners = [];
    }
    show(message, type = 'info', duration = 3000) {
        const id = Date.now().toString();
        const notification = { id, message, type, duration };
        this.notifications.set(id, notification);
        this.notifyListeners();
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id);
            }, duration);
        }
    }
    remove(id) {
        this.notifications.delete(id);
        this.notifyListeners();
    }
    subscribe(callback) {
        this.listeners.push(callback);
    }
    notifyListeners() {
        const notificationList = Array.from(this.notifications.values());
        this.listeners.forEach(listener => listener(notificationList));
    }
}
export const notificationService = new NotificationService();
//# sourceMappingURL=NotificationService.js.map