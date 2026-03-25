// Task Model
export interface Task {
  id: number;
  titulo: string;
  categoria: string;
  concluida: boolean;
  responsavelNome: string;
  dataConclusao: string | null;
  created_at: string;
}

export interface TaskStats {
  total: number;
  concluidas: number;
  pendentes: number;
  percentagem: number;
}
