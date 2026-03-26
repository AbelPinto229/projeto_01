export interface User {
    id: number;
    name: string;
    email: string;
    status: 'active' | 'inactive';
    createdAt: string;
}
export interface Task {
    id: number;
    title: string;
    category: string;
    responsible: string;
    tags: string[];
    status: 'pending' | 'in-progress' | 'completed';
    createdAt: string;
}
export interface Tag {
    id: number;
    name: string;
    color: string;
}
//# sourceMappingURL=AppUiTypes.d.ts.map