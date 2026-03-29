// Task Model
export interface Task {
  id: number;
  titulo: string;
  categoria: string;
  estado: 'pending' | 'in-progress' | 'completed';
  concluida: boolean;
  responsavelNome: string;
  dataConclusao: string | null;
  created_at: string;
  tags?: string[];
  tagIds?: number[];
}

export interface TaskStats {
  total: number;
  concluidas: number;
  pendentes: number;
  percentagem: number;
}
