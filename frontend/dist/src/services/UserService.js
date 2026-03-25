// FAKE DATA
const fakeUsers = [
    { id: 1, name: 'João Silva', email: 'joao@example.com', active: true, created_at: '2024-01-15' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', active: true, created_at: '2024-01-20' },
    { id: 3, name: 'Pedro Oliveira', email: 'pedro@example.com', active: false, created_at: '2024-02-01' },
    { id: 4, name: 'Ana Costa', email: 'ana@example.com', active: true, created_at: '2024-02-10' },
    { id: 5, name: 'Carlos Mendes', email: 'carlos@example.com', active: true, created_at: '2024-02-15' },
    { id: 6, name: 'Sofia Pereira', email: 'sofia@example.com', active: false, created_at: '2024-03-01' },
    { id: 7, name: 'Miguel Ferreira', email: 'miguel@example.com', active: true, created_at: '2024-03-05' },
    { id: 8, name: 'Beatriz Gomes', email: 'beatriz@example.com', active: true, created_at: '2024-03-10' }
];
export class UserService {
    constructor() {
        this.users = [...fakeUsers];
        this.nextId = 9;
    }
    // Get all users with optional filters
    async getUsers(search, sort) {
        let filtered = [...this.users];
        if (search) {
            filtered = filtered.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) ||
                u.email.toLowerCase().includes(search.toLowerCase()));
        }
        if (sort === 'asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if (sort === 'desc') {
            filtered.sort((a, b) => b.name.localeCompare(a.name));
        }
        return Promise.resolve(filtered);
    }
    // Get user statistics
    async getUserStats() {
        const total = this.users.length;
        const active = this.users.filter(u => u.active).length;
        const inactive = total - active;
        const percentage = Math.round((active / total) * 100);
        return Promise.resolve({
            total,
            active,
            inactive,
            percentage
        });
    }
    // Create new user
    async createUser(name, email) {
        const newUser = {
            id: this.nextId++,
            name,
            email,
            active: true,
            created_at: new Date().toISOString().split('T')[0]
        };
        this.users.push(newUser);
        return Promise.resolve(newUser);
    }
    // Get specific user
    async getUser(id) {
        const user = this.users.find(u => u.id === id);
        if (!user)
            throw new Error('Utilizador não encontrado');
        return Promise.resolve(user);
    }
    // Update user
    async updateUser(id, name, email) {
        const user = this.users.find(u => u.id === id);
        if (!user)
            throw new Error('Utilizador não encontrado');
        user.name = name;
        user.email = email;
        return Promise.resolve(user);
    }
    // Toggle user active status
    async toggleUserStatus(id) {
        const user = this.users.find(u => u.id === id);
        if (!user)
            throw new Error('Utilizador não encontrado');
        user.active = !user.active;
        return Promise.resolve(user);
    }
    // Delete user
    async deleteUser(id) {
        this.users = this.users.filter(u => u.id !== id);
        return Promise.resolve();
    }
    // Get user tasks
    async getUserTasks(id) {
        // Mock: return tasks assigned to this user
        return Promise.resolve([]);
    }
}
//# sourceMappingURL=UserService.js.map