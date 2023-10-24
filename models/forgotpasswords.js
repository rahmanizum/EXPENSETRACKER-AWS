const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswords = sequelize.define('Forgotpasswords', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: Sequelize.UUIDV4, 
  },
  isactive: {
    type: Sequelize.BOOLEAN, 
    allowNull: false,
    defaultValue: true, 
  },
});

module.exports = ForgotPasswords;

