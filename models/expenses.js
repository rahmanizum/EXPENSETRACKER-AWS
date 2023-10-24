const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Expenses = sequelize.define('Expenses',{
    id: {
        type :Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull:false
    },
    category:{
        type: Sequelize.STRING(),
        allowNull:false
    },
    pmethod:{
        type: Sequelize.STRING() ,
        allowNull: false
    },
    amount:{
        type: Sequelize.FLOAT(),
        allowNull: false
    },
    date:{
        type: Sequelize.DATEONLY(),
        allowNull: false
    }
})
module.exports=Expenses;