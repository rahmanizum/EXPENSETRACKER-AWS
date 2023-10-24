const Sequelize = require('sequelize');
const sequelize = require('../util/database')
const User = sequelize.define('User',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement: true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type : Sequelize.STRING,
        allowNull:false
    },
    email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type: Sequelize.TEXT,
        allowNull:false 
    },
    totalexpenses:{
        type:Sequelize.FLOAT(),
        defaultValue:0.00   
    },
    ispremiumuser:{
        type: Sequelize.BOOLEAN,
        defaultValue:false,
    }
})
module.exports=User;