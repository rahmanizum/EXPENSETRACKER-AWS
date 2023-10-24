const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,    
    process.env.DATABASE_USERNAME, 
    process.env.DATABASE_PASSWORD, 
    {
      dialect: process.env.DATABASE_DIALECT, 
      host: process.env.DATABASE_HOST,        
      logging: false
    }
  );
  
  module.exports = sequelize;
module.exports = sequelize;