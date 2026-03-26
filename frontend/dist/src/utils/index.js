// Utils - Task utilities
export class TaskUtils {
    static getStatusBadgeColor(concluida) {
        return concluida ? 'status-completed' : 'status-pending';
    }
    static getStatusText(concluida) {
        return concluida ? 'Concluída' : 'Pendente';
    }
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT');
    }
}
//# sourceMappingURL=index.js.map