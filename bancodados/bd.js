const Sequelize = require('sequelize')

 const conexao = new Sequelize('teste', 'root', 'database',{dialect:'mysql',host:'localhost' })



module.exports = conexao