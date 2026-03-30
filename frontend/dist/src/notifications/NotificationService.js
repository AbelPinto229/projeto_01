// gere o ciclo de vida das notificações e avisa os subscritores
export class NotificationService {
    constructor() {
        // mapa em memória para acesso rápido por id
        this.notifications = new Map();
        // callbacks chamados sempre que a lista muda
        this.listeners = [];
    }
    // cria uma notificação e agenda remoção automática quando duration > 0
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
    // remove uma notificação específica
    remove(id) {
        this.notifications.delete(id);
        this.notifyListeners();
    }
    // regista um listener para mudanças na lista de notificações
    subscribe(callback) {
        this.listeners.push(callback);
    }
    // notifica todos os listeners com o estado atual
    notifyListeners() {
        const notificationList = Array.from(this.notifications.values());
        this.listeners.forEach(listener => listener(notificationList));
    }
}
export const notificationService = new NotificationService();
//# sourceMappingURL=NotificationService.js.map