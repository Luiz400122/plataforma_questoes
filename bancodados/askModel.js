const conexao = require('./bd')
const Sequelize = require('sequelize')

const Pergunta = conexao.define('perguntas', {
    titulo:{
        type:Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type:Sequelize.TEXT,
       allowNull:false
    }

})

//Pergunta.sync({force:true})

module.exports = Pergunta