const express = require('express')
const bd = require('./bancodados/bd')
const app = express()

//import Model
const Pergunta = require('./bancodados/askModel')
const Resposta = require('./bancodados/Resposta')

//estou dizendo para usar o ejs como view engine
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))

//teste conexao
bd.authenticate().then(function(){console.log('banco ok')}).catch((err)=>{console.log(err + 'falha ao conectat')})

app.get('/', (req, res)=>{

    Pergunta.findAll({raw:true, order:[['id','DESC']]}).then(perguntas=> res.render('index',{
    perguntas:perguntas} //asc  - crescente; desc - descrecente
    ))

  
  //findAll - EQUIVALE ao SElECT * DO MYSQL; LISTA E LE TODOS OS VALORES DA TABELA
   
})

app.get('/respondidas/:id', (req, res)=>{
  Pergunta.findOne({where:{
    "id":req.params.id
  }}
  ).then(function(pergunta){
   
      Resposta.findAll({
        where:{perguntaId:pergunta.id },
        order:[
          ["id","DESC"]
        ]
      }).then(function(respostas){
        res.render('respondidas', {pergunta:pergunta,
        respostas:respostas})
      })
    })

  })

//ROTA PARA RESPOSTA DE PERGUNTAS POR ID
app.get('/pergunta/:id', (req, res)=>{
  Pergunta.findOne({where:{
    "id":req.params.id
  }}).then(function(pergunta){
    if(pergunta){
  
      Resposta.findAll({
        where:{perguntaId:pergunta.id}
      }).then(function(respostas){
        res.render('pergunta', {pergunta:pergunta,
        respostas:respostas})
      })

    }else{
    res.redirect('/')
    }
 
  })
})

//page para edição de uma pergunta por ID
app.get('/editar/:id', function(req, res){
 Pergunta.findOne({where:{
  "id":req.params.id
 }}).then((pergunta)=>{

   res.render('perguntaedit.ejs', {pergunta: pergunta})
 })
 
})


//ROTA PARA EDIÇÃO DA PERGUNTA PELO ID
app.post('/edicao/:id', (req, res)=>{
  var id = req.params.id
  var {titulo, descricao} = req.body

  Pergunta.update(
    {titulo, descricao},
    {where:{"id":id}}
  ).then(function(){
    res.redirect('/editar/'+id)  
  })
  .catch((err)=>{
    console.log(err + " erro")
  })
})


// rota para exlusão da pergunta
app.get('/excluir/:id', (req, res)=>{

  const perguntaId = req.params.id;

  // Rota para deleção de Perguntas pelo ID
  Pergunta.destroy({
    where: { 'id': perguntaId }
  })
  .then(function () {
    // também deleta a resposta relacionada nos bd
    return Resposta.destroy({
      where: { perguntaId: perguntaId }
    });
  })
  .then(() => res.redirect('/'))
  })
    
 
 

// ROTA PARA A PAGE DE ELABORAÇÃO DE PERGUTNAS
app.get('/perguntar', (req, res)=>[
    res.render('question')
])

//ROTEAMENTO PARA CRIAR UMA PERGUNTA COM DOS DADOS DA MODEL
app.post('/save', (req, res)=>{
    var titulo = req.body.titulo
    var id = req.params.id
    var descricao = req.body.descricao
    Pergunta.create({
        titulo:titulo,
        descricao:descricao
    }).then(function(){
      res.redirect('/')  
    })

})

// rota para resposta de perguntas
app.post('/responder', (req, res)=>{
  var corpo = req.body.corpo
  var pergunta_id = req.body.pergunta
  Resposta.create({
    resposta:corpo,
    perguntaId : pergunta_id
  }).then(()=>{res.redirect('/pergunta/'+pergunta_id)})
})

//SERVIDOR
app.listen(3000, ()=>console.log('Servidor ativo.'))