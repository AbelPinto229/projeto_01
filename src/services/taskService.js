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
  let sql = 'SELECT * FROM tasks';
  const params = []; 

  if (query.search) {
    sql += ' WHERE titulo LIKE ?';
    params.push(`%${query.search}%`);
  }

  if (query.sort === 'asc') {
    sql += ' ORDER BY titulo ASC';
  } else if (query.sort === 'desc') {
    sql += ' ORDER BY titulo DESC';
  }

  const [rows] = await db.query(sql, params);
  return rows;
};


//executa uma funcao asyncrona que recebe a data atraves do controller, que é o req.body no controller
//enviado pelo cliente atraves do post, depois executa uma instrucao sql atraves do db.query
//em que os ? iram ser substitiuos pela data da requisicao, o ?? faz com que se o valor for nulo ou undefined
//ele retorna o valor da direita, ele retorna uma tarefa com o id gerado pelo banco de dados com os valores
//que o cliente definiu, os ...data ajuda a nao repetir o codigo senao tinha que coloca titulo = data.titulo
//categoria = data.categoria e por ai adiante.
export const createTask = async (data) => {

  const [result] = await db.query(
    'INSERT INTO tasks (titulo, categoria, concluida, responsavelNome, dataConclusao) VALUES (?, ?, ?, ?, ?)',
    [data.titulo, data.categoria, data.concluida ?? false, data.responsavelNome, data.dataConclusao ?? null]
  );

  return {
    id: result.insertId,
    ...data,
    concluida: data.concluida ?? false,
    dataConclusao: data.dataConclusao ?? null
  };
};

//executa um funcao asyncrona que recebe o id da tarefa e a data, pelo controller, o id é o req.param.id
// e o data é o req.body no controller enviado pelo cliente atraves do id da rota put e body da requisicao
// depois executa uma instrucao sql atraves do db.query para buscar a tarefa pelo id, se o lenght for 0 significa 
// que a tarefa nao existe e lança um erro, se existir ele pega a tarefa existente e realiza outra instrucao
//de SQL para atualizar a tarefa, em que os ? serao substituidos pelo valores de entrada, usando o ??
// neste caso para manter o valor existente se o cliente nao enviar um valor para esse campo
//depois guarda esse objeto no array updated e retorna o primeiro elemento do array que a tarefa é
//atualizada

export const updateTask = async (id, data) => {
  const [existing] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  
  if (existing.length === 0) {
    throw new Error("Tarefa não encontrada");
  }

  const task = existing[0];
  await db.query(
    'UPDATE tasks SET titulo = ?, categoria = ?, concluida = ?, responsavelNome = ?, dataConclusao = ? WHERE id = ?',
    [
      data.titulo ?? task.titulo,
      data.categoria ?? task.categoria,
      data.concluida ?? task.concluida,
      data.responsavelNome ?? task.responsavelNome,
      data.dataConclusao ?? task.dataConclusao,
      id
    ]
  );

  const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return updated[0];
};

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
//o task id é enviado pelo cliente atraves do id da rota, id.param e o tagdata é o req.body no controller
//que é enviado pelo cliente atraves do req.body, a instrucao consulta a tabela e se 
//a tag ja existir associada à tarefa manda um erro, se existir, é criada uma nova instrucao para 
// inserir a tag na tarefa, executa uma instrucao em que o ? sao substituios pelos valores do array 
// que o cliente enviou, depois retorna uma mensagem de sucesso para o cliente.
export const addTagToTask = async (taskId, tagData) => {

  const [alreadyExists] = await db.query(
    'SELECT * FROM task_tags WHERE task_id = ? AND tag_id = ?',
    [taskId, tagData.tag_id]
  );
  
  
  if (alreadyExists.length > 0) {
    throw new Error("Tag já associada a esta task");
  }

  await db.query(
    'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)',
    [taskId, tagData.tag_id]
  );
  
  return { message: "Tag adicionada à task com sucesso" };
};
