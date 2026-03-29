export interface Task {
    id: number;
    titulo: string;
    categoria: string;
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
//# sourceMappingURL=Task.d.ts.map