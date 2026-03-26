// FAKE DATA
const fakeComments = [
    { id: 1, task_id: 1, user_id: 1, conteudo: 'Bom dia! Comecei a trabalhar na implementação da autenticação com JWT. Vou estar a configurar os endpoints para login e registar novo utilizador. Estimativa de conclusão: final desta semana.', dataCriacao: '2024-02-10' },
    { id: 2, task_id: 1, user_id: 2, conteudo: 'Ótimo! Lembra-te de implementar também a autenticação com OAuth e verificação de dois fatores. Deixa-me uma nota quando tiveres os endpoints prontos para eu testar.', dataCriacao: '2024-02-11' },
    { id: 3, task_id: 1, user_id: 4, conteudo: 'Já implementei os testes para os endpoints de autenticação. Todos os testes de login e registar passaram com sucesso. O sistema está robusto e seguro.', dataCriacao: '2024-02-14' },
    { id: 4, task_id: 2, user_id: 2, conteudo: 'Terminei o design do dashboard. Foi necessário fazer vários ajustes ao tema de cores e às dimensões dos componentes para melhor usabilidade. O design está pronto para implementação no frontend.', dataCriacao: '2024-02-18' },
    { id: 5, task_id: 3, user_id: 3, conteudo: 'Teste de API completo realizado! Testei todos os endpoints de utilizadores e tarefas. Encontrei 3 pequenos bugs que já foram corrigidos pela equipa de backend. Sistema operacional.', dataCriacao: '2024-02-25' },
    { id: 6, task_id: 6, user_id: 4, conteudo: 'Sistema de notificações implementado! Utilizadores recebem notificações em tempo real quando são atribuídas novas tarefas ou quando comentários são adicionados. Testes de carga realizados com sucesso.', dataCriacao: '2024-03-08' },
    { id: 7, task_id: 7, user_id: 5, conteudo: 'Otimização das queries SQL concluída! Reduzi o tempo de resposta em 40% através da adição de índices estratégicos e refatorização das queries complexas. Performance significativamente melhorada.', dataCriacao: '2024-03-05' },
    { id: 8, task_id: 8, user_id: 6, conteudo: 'Testes unitários criados para todos os serviços principais. Cobertura de testes agora em 85%. Ainda faltam testes para casos extremos, mas a base está bem consolidada.', dataCriacao: '2024-03-12' }
];
export class CommentService {
    constructor() {
        this.comments = [...fakeComments];
        this.nextId = 9;
    }
    // Create comment
    createComment(taskId, userId, conteudo) {
        const newComment = {
            id: this.nextId++,
            task_id: taskId,
            user_id: userId,
            conteudo,
            dataCriacao: new Date().toISOString().split('T')[0]
        };
        this.comments.push(newComment);
        return newComment;
    }
    // Update comment
    updateComment(taskId, commentId, conteudo) {
        const comment = this.comments.find(c => c.id === commentId && c.task_id === taskId);
        if (!comment)
            throw new Error('Comentário não encontrado');
        comment.conteudo = conteudo;
        return comment;
    }
    // Delete comment
    deleteComment(taskId, commentId) {
        this.comments = this.comments.filter(c => !(c.id === commentId && c.task_id === taskId));
    }
}
//# sourceMappingURL=CommentService.js.map