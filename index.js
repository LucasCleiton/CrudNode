
//CRIANDO APP EXPRESS
const express = require('express');
const app = express();

//CONFIGURANDO MARKO
require('marko/node-require');
var markoExpress = require("marko/express");
app.use(markoExpress());

//CONFIGURANDO BODYPARSER
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

//CRIANDO DAO
const AlunoDao = require('./dao/aluno-dao');
const dao = new AlunoDao();

//CONFIGURANDOA MENSAGEMS FLASH
const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
    secret:'geeksforgeeks',
    seveUninitialized: true,
    resave: true
}));
app.use(flash());


//IMPLEMENTANDO ROTAS

app.get('/',function(req, res){

    let response ={
        error_messages: req.flash('error'),
        success_messages: req.flash('success'),
        results:[]

    }

    dao.list().then( (results) =>{

        response.results = results;

        res.marko(require('./templates/alunos.marko'), response);

    }).catch( (err) => {
        console.log(err);
        response.error_messages.push('Ocorreu algum erro no servidor');
        
        res.marko(require('./templates/alunos.marko'), response);
    });


    

   
    
});

app.get('/form',function(req, res){
    res.marko(require('./templates/form.marko'));
});



app.get('/form/:id', function(req, res){

   dao.findById(req.params.id).then( (result)=> {
        

        if (result.length >0 ){
           aluno = result [0]
           res.marko(require('./templates/form.marko'),aluno);
    
        }else{
            req.flash('error', 'Não foi encontrado aluno com ID ' + req.params.id);
            res.redirect('/');
        }
    
    }).catch( (err) => {
        console.log(err);
        req.flash('error', 'Ocorreu um erro ao buscar o aluno ID ' + req.params.id);
        res.redirect('/');
       
    } );

});


app.get('/alunos/delete/:id',function(req, res){
    dao.delete(req.params.id).then((result)=> {

        req.flash('sucess','Usuario removido');
        res.redirect('/');

    }).catch((err) =>{
        
        console.log(err);
        req.flash('error','Erro ao remover');
        res.redirect('/');
    });

    
});

app.post('/alunos', function(req , res){
    if(req.body.id){
        dao.update(req.body).then( (result) => {
            req.flash('success','Dados Atualizados!')
            res.redirect('/')
        }).catch((err) => {
            console.log(err)
            req.flash('error','Erro ao aluno de ID : ')
            res.redirect('/')
        })
   
        
    }else{
        dao.save(req.body).then( (results)=>{
            req.flash('success','Aluno Salvo com Sucesso!');
            res.redirect('/');

        }).catch((err)=>{
            console.log(err);
            req.flash('error','Ocorreu um erro ao salvar dados!');
            res.redirect('/');
        });
    }
    
    
    
});

app.listen(3000,'0.0.0.0',function(){
    console.log('Servidor Iniciado...');
});