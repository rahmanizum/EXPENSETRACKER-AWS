const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Order = sequelize.define('order', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    paymentid: {
        type: Sequelize.STRING(),
        allowNull: true
    },
    orderid:{
        type: Sequelize.STRING(),
        allowNull :false
    },
    status:{
        type: Sequelize.STRING(),
        defaultValue:"pending",
    }
})
module.exports=Order;