const bd = require('./bd')
const Sequelize = require('sequelize')

const Resposta= bd.define('respostas',{
    resposta:{
        type:Sequelize.TEXT,
    allowNull:false},
    perguntaId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})


//Resposta.sync({force:true})


module.exports = Resposta