'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      full_name: {
        type: Sequelize.STRING,
				defaultValue: ''
      },
      username: {
        type: Sequelize.STRING,
				unique: true, 
				allowNull: false
      },
      email: {
        type: Sequelize.STRING,
				defaultValue: ''
      },
      phone_number: {
        type: Sequelize.STRING,
				defaultValue: ''
      },
      password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Customers');
  }
};