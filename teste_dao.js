const AlunoDao = require('./dao/aluno-dao');
let dao = new AlunoDao();


dao.findById(2).then( (result)=> {

    if (result.length >0 ){
        console.log('----------')
        aluno= result[0]
        console.log(aluno)
        console.log(aluno.nome)

    }else{
        console.log('Não Encontrado')
    }

}).catch( (err) => {
    console.log(err);
   
} );
