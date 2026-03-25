// Notification types
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// Notification Service
export class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private listeners: Array<(notifications: Notification[]) => void> = [];

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration = 3000): void {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };

    this.notifications.set(id, notification);
    this.notifyListeners();

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  remove(id: string): void {
    this.notifications.delete(id);
    this.notifyListeners();
  }

  subscribe(callback: (notifications: Notification[]) => void): void {
    this.listeners.push(callback);
  }

  private notifyListeners(): void {
    const notificationList = Array.from(this.notifications.values());
    this.listeners.forEach(listener => listener(notificationList));
  }
}

export const notificationService = new NotificationService();
