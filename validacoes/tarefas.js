const validar = (tarefa) => {
    // nome, login, email e senha são obrigatórios
    // Validações
    const erros = []

    if(!tarefa.nome || tarefa.nome == ""){
        erros.push("Campo nome não pode ser vazio.")
    }

    if(!tarefa.descricao || tarefa.descricao == ""){
        erros.push("Campo descricao não pode ser vazio.");
    }

    if(!tarefa.status || tarefa.status == ""){
        erros.push("Campo status não pode ser vazio.");
    }

    // Se existe campo inválido
    if(erros.length > 0){
        throw new Error(JSON.stringify({
            status: 400,
            erros
        }))
    }else{
        return true
    }
}

module.exports = validar