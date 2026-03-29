// db é um objeto pool de conexões configurado em db.js e permite executar queries SQL através do db.query()

import { db } from "../db.js";

//executa uma funcao asyncrona que recebe um objeto como parametros se nao for passada nada assume vazia, 
// depois executa a instrucao sql o const params é o array de entrada se existir pesquisa ele é preenchido
//segue com o if query.search que é enviado pelo cliente atraves de um get e os parametos colocados
//é realizada uma consulta atraves do % para buscar parte do ttulo, se for preenchido com o paramentro 
// asc ou desc ele ordena o resultado, o const rows descontroi o resultado que é um array de objetos
// pelo primeiro elemento do array, o sql é a instrucao sql e o params é o array que substitui
// o ? ou seja o filtro de busca, o resultado é guardado e depois retornado no return rows.
//o sql +- é para concetenar o string da instrucao, ou seja a linha select com a linha where, senao 
//nao funciona.
export const getTasks = async (query = {}) => {
  let sql = `
    SELECT
      tasks.id,
      tasks.titulo,
      tasks.categoria,
      tasks.estado,
      tasks.concluida,
      tasks.responsavelNome,
      tasks.dataConclusao,
      tasks.created_at,
      GROUP_CONCAT(DISTINCT task_tags.tag_id ORDER BY task_tags.tag_id SEPARATOR ',') AS tagIdsCsv,
      GROUP_CONCAT(DISTINCT tags.nome ORDER BY tags.nome SEPARATOR ',') AS tagNamesCsv
    FROM tasks
    LEFT JOIN task_tags ON task_tags.task_id = tasks.id
    LEFT JOIN tags ON tags.id = task_tags.tag_id
  `;
  const params = []; 

  if (query.search) {
    sql += ' WHERE tasks.titulo LIKE ?';
    params.push(`%${query.search}%`);
  }

  sql += `
    GROUP BY
      tasks.id,
      tasks.titulo,
      tasks.categoria,
      tasks.estado,
      tasks.concluida,
      tasks.responsavelNome,
      tasks.dataConclusao,
      tasks.created_at
  `;

  if (query.sort === 'asc') {
    sql += ' ORDER BY tasks.titulo ASC';
  } else if (query.sort === 'desc') {
    sql += ' ORDER BY tasks.titulo DESC';
  }

  const [rows] = await db.query(sql, params);
  return rows.map((row) => {
    const tagIds = row.tagIdsCsv
      ? row.tagIdsCsv.split(',').map((value) => Number(value))
      : [];
    const tags = row.tagNamesCsv
      ? row.tagNamesCsv.split(',')
      : [];

    return {
      id: row.id,
      titulo: row.titulo,
      categoria: row.categoria,
      estado: row.estado,
      concluida: row.concluida,
      responsavelNome: row.responsavelNome,
      dataConclusao: row.dataConclusao,
      created_at: row.created_at,
      tagIds,
      tags
    };
  });
};


//executa uma funcao asyncrona que recebe a data atraves do controller, que é o req.body no controller
//enviado pelo cliente atraves do post, depois executa uma instrucao sql atraves do db.query
//em que os ? iram ser substitiuos pela data da requisicao, o ?? faz com que se o valor for nulo ou undefined
//ele retorna o valor da direita, ele retorna uma tarefa com o id gerado pelo banco de dados com os valores
//que o cliente definiu, os ...data ajuda a nao repetir o codigo senao tinha que coloca titulo = data.titulo
//categoria = data.categoria e por ai adiante.
export const createTask = async (body) => {
  const estado = body.estado ?? (body.concluida ? 'completed' : 'pending');
  const concluida = estado === 'completed';
  const dataConclusao = estado === 'completed' ? (body.dataConclusao ?? new Date().toISOString().slice(0, 10)) : null;

  const [result] = await db.query(
    'INSERT INTO tasks (titulo, categoria, estado, concluida, responsavelNome, dataConclusao) VALUES (?, ?, ?, ?, ?, ?)',
    [body.titulo, body.categoria, estado, concluida, body.responsavelNome, dataConclusao]
  );

  return {
    id: result.insertId,
    ...body,
    estado,
    concluida,
    dataConclusao
  };
};

//executa um funcao asyncrona que recebe o id da tarefa e o body, pelo controller, o id é o req.param.id
// e o body é o req.body no controller enviado pelo cliente atraves do id da rota put e body da requisicao
// depois executa uma instrucao sql atraves do db.query para buscar a tarefa pelo id, se o lenght for 0 significa 
// que a tarefa nao existe e lança um erro, se existir ele pega a tarefa existente e realiza outra instrucao
//de SQL para atualizar a tarefa, em que os ? serao substituidos pelo valores de entrada, usando o ??
// neste caso para manter o valor existente se o cliente nao enviar um valor para esse campo
//depois guarda esse objeto no array updated e retorna o primeiro elemento do array que a tarefa é
//atualizada

export const updateTask = async (id, body) => {
  const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  
  if (rows.length === 0) {
    throw new Error("Tarefa não encontrada");
  }

  const task = rows[0]; 
  
  const newTask = {   
      titulo : body.titulo ?? task.titulo,
      categoria : body.categoria ?? task.categoria,
      estado : body.estado ?? task.estado ?? (task.concluida ? 'completed' : 'pending'),
      responsavelNome : body.responsavelNome ?? task.responsavelNome,
      id: task.id
  };

  newTask.concluida = newTask.estado === 'completed';
  newTask.dataConclusao = newTask.estado === 'completed'
    ? (body.dataConclusao ?? task.dataConclusao ?? new Date().toISOString().slice(0, 10))
    : null;

  await db.query(
    'UPDATE tasks SET titulo = ?, categoria = ?, estado = ?, concluida = ?, responsavelNome = ?, dataConclusao = ? WHERE id = ?',
    [
      newTask.titulo,
      newTask.categoria,
      newTask.estado,
      newTask.concluida,
      newTask.responsavelNome,
      newTask.dataConclusao,
      newTask.id
    ]
  );
  
  return newTask; 
}

//executa um funcao asyncrona que recebe o id da tarefa pelo controller, o id é o id.param que é o
//o id da rota passado pelo requiscao DELETE do cliente, execura uma instrucao sql atraves do db.query
//onde deleta a tarefa pelo id, se nenhuma linha for afetada entrao o if manda o erro que nao foi encontrada
//se for alguma for afetada ele elimina e mostra a mensagem de sucesso para o cliente.
export const deleteTask = async (id) => {

  const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
  
  if (result.affectedRows === 0) {
    throw new Error("Tarefa não encontrada");
  }
  return { message: "Tarefa deletada com sucesso" };
};

// executa uma funcao syncronna que nao recebe nenhum parametro e executa uma instrucao sql atraves
//do db.query para contar o total de tarefas se as tarefas tiverem concluida soma 1 senao 0 como concluidas
// e se tiver pendente, soma 1 senao 0 como pendente, depois retorna um objeto com o total de tarefas
//total de concluidas e total de pendentes para o cliente, o resultado é guardado no array e o primeiro
//elemento do array é retornado rows[0], se fosse rows retornava as linhas todas, assim retorna só a primeira,
// ou seja é retornado para o cliente, total: 10, concluidas: 5, pendentes: 5.
export const getTaskStats = async () => {
  const [rows] = await db.query(`
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN concluida = 1 THEN 1 ELSE 0 END) AS concluidas,
      SUM(CASE WHEN concluida = 0 THEN 1 ELSE 0 END) AS pendentes
    FROM tasks
  `);

  return rows[0];
};

// executa uma funcao asyncrona que recebe o id do usario atraves da do parametro de rota do get
// enviado pelo cliente, depois executa a instrucao sql que é guardada no array de entrada rows
//a instrucao sql faz uma consulta das task onde o responsavel é igual ao nome do usuario com o mesmo id
//enviado pelo cliente, depois retorna o array de objetos com as tarefas desses usuario
export const getTasksByUserId = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM tasks WHERE responsavelNome = (SELECT name FROM users WHERE id = ?)',
    [userId]
  );
  return rows;
};

//executa um funcao asyncrona que recebe o id da tarefa e o id da tag atraves do controller, ou seja 
//o task id é enviado pelo cliente atraves do id da rota, id.param e o tagBody é o req.body no controller
//que é enviado pelo cliente atraves do req.body, a instrucao consulta a tabela e se 
//a tag ja existir associada à tarefa manda um erro, se existir, é criada uma nova instrucao para 
// inserir a tag na tarefa, executa uma instrucao em que o ? sao substituios pelos valores do array 
// que o cliente enviou, depois retorna uma mensagem de sucesso para o cliente.
export const addTagToTask = async (taskId, tagBody) => {
  const tagId = tagBody.tag_id ?? tagBody.tagId;

  if (!tagId) {
    throw new Error("Tag inválida para associação");
  }

  const [rows] = await db.query(
    'SELECT * FROM task_tags WHERE task_id = ? AND tag_id = ?',
    [taskId, tagId]
  );
  
  
  if (rows.length > 0) {
    throw new Error("Tag já associada a esta task");
  }

  await db.query(
    'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)',
    [taskId, tagId]
  );
  
  return { message: "Tag adicionada à task com sucesso" };
};

// remove a associação entre tarefa e tag
export const removeTagFromTask = async (taskId, tagId) => {
  if (!tagId) {
    throw new Error("Tag inválida para remoção");
  }

  const [result] = await db.query(
    'DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?',
    [taskId, tagId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Associação de tag não encontrada para esta task");
  }

  return { message: "Tag removida da task com sucesso" };
};
