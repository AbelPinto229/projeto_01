// Utils - Task utilities
export class TaskUtils {
  static getStatusBadgeColor(concluida: boolean): string {
    return concluida ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700';
  }

  static getStatusText(concluida: boolean): string {
    return concluida ? 'Concluída' : 'Pendente';
  }

  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  }
}
