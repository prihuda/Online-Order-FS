'use strict';

const bcrypt = require('bcrypt');
const salt = 10;

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('Drivers', 
			[
				{
					full_name: 'Hardo Fernando Silalahi',
          phone_number: '08135557000',
          password: bcrypt.hashSync('asdasd', salt),
					createdAt: new Date(),
					updatedAt: new Date()
				},
				{
					full_name: 'Abdul Salim',
          phone_number: '08185598189',
          password: bcrypt.hashSync('asdasd', salt),
					createdAt: new Date(),
          updatedAt: new Date()
				}
			], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Drivers', null, {});
  }
};
