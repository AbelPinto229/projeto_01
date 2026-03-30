// contrato de uma notificação exibida na interface
export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

// gere o ciclo de vida das notificações e avisa os subscritores
export class NotificationService {
  // mapa em memória para acesso rápido por id
  private notifications: Map<string, Notification> = new Map();
  // callbacks chamados sempre que a lista muda
  private listeners: Array<(notifications: Notification[]) => void> = [];

  // cria uma notificação e agenda remoção automática quando duration > 0
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

  // remove uma notificação específica
  remove(id: string): void {
    this.notifications.delete(id);
    this.notifyListeners();
  }

  // regista um listener para mudanças na lista de notificações
  subscribe(callback: (notifications: Notification[]) => void): void {
    this.listeners.push(callback);
  }

  // notifica todos os listeners com o estado atual
  private notifyListeners(): void {
    const notificationList = Array.from(this.notifications.values());
    this.listeners.forEach(listener => listener(notificationList));
  }
}

export const notificationService = new NotificationService();
