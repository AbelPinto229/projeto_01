// utilitários partilhados para apresentação de tarefas
export class TaskUtils {
  // devolve a classe css do badge com base no estado de conclusão
  static getStatusBadgeColor(concluida: boolean): string {
    return concluida ? 'status-completed' : 'status-pending';
  }

  // devolve o texto de estado a mostrar na interface
  static getStatusText(concluida: boolean): string {
    return concluida ? 'Concluída' : 'Pendente';
  }

  // formata uma data para o formato local pt-pt
  static formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT');
  }
}
