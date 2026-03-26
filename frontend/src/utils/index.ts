// Utils - Task utilities
export class TaskUtils {
  static getStatusBadgeColor(concluida: boolean): string {
    return concluida ? 'status-completed' : 'status-pending';
  }

  static getStatusText(concluida: boolean): string {
    return concluida ? 'Concluída' : 'Pendente';
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  }
}
