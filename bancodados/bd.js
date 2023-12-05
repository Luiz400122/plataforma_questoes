const Sequelize = require('sequelize')

 const conexao = new Sequelize('teste', 'root', 'felipe05',{dialect:'mysql',host:'localhost' })



module.exports = conexao