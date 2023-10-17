const validacaoTarefa = require('../validacoes/tarefas')

// Banco de dados em memória
let tarefas_db = [
    {
        id: 1,
        nome: "passeio",
        descricao: "passear com a jo",
        status: "A FAZER"
    },
    {
        id: 2,
        nome: "estudar",
        descricao: "estudar algo",
        status: "FAZENDO"
    }
]

let ultimo_id = 2

function transformarTarefaParaRetorno(tarefa){
    return {
        id: tarefa.id,
        nome: tarefa.nome,
        descricao: tarefa.descricao,
        status: tarefa.status
    }
}

function buscarTarefa(id){
    // Verificar se o usuário existe
    // filtrei todos os usuarios que atendem ao id passado  
    const tarefas_filtrados = tarefas_db.filter(tarefa => {
        return tarefa.id == id
    })

    // pegar e devolver os dados sem a senha
    // peguei o primeiro usuario da lista
    if(tarefas_filtrados.length == 0){
        throw new Error(JSON.stringify({
            status: 404
        }))
    }

    return tarefas_filtrados[0]
}

const tarefas = () => {
    return {
        getById: (id) => {
            // Buscar usuário na base
            const tarefa = buscarTarefa(id)

            return transformarTarefaParaRetorno(tarefa)
        },
        getAll: (parametros) => {
            let tarefas_filtrados = tarefas_db
            // transformação dos dados para esconder atributos
            tarefas_filtrados = tarefas_db.map((tarefa) => transformarTarefaParaRetorno(tarefa))

            // filtragem pelos parâmetros se existirem
            const camposParaValidar = Object.keys(parametros)
            // [nome, login, email] => por exemplo

            // Se existe parâmetro enviado pelo cliente
            if(camposParaValidar.length > 0){
                tarefas_filtrados = tarefas_filtrados.filter(tarefa => {
                    let ehValido = true

                    camposParaValidar.forEach(campo => {
                        if(!tarefa[campo].includes(parametros[campo])){
                            ehValido = false
                        }
                    })

                    return ehValido
                })
            }

            // retorno do resultado
            return tarefas_filtrados
        },
        create: (dados) => {
            // Pego o último id inserido
            // Já tenho o último id sendo controlado por uma variável
            // Criar um usuário com os dados enviados
            const tarefa_novo = dados

            // Validar o usuário criado
            validacaoTarefa(tarefa_novo)

            // Atribuir um id 
            tarefa_novo.id = ++ultimo_id

            // Salvar no banco de dados
            tarefas_db.push(tarefa_novo)

            // retornar o usuário salvo
            return tarefa_novo
        },
        update: (dados, id) => {
            // busca o usuário pelo ID
            const tarefa_cadastrado = buscarTarefa(id)

            // Validar dados enviados
            validacaoTarefa(dados)

            // atualiza os dados do usuário buscado
            tarefa_cadastrado.nome = dados.nome
            tarefa_cadastrado.descricao = dados.descricao
            tarefa_cadastrado.status = dados.status

            return tarefa_cadastrado
        },
        destroy: (id) => {
            // Verificando se o usuário existe.
            const tarefa = buscarTarefa(id)

            // cria um novo array sem o usuário que deve ser excluído
            tarefas_db = tarefas_db.filter(tarefa => tarefa.id != id)

            return true
        }
    }
}

module.exports = {
    tarefas,
    buscarTarefa
}