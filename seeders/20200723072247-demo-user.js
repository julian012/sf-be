'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('User', [{
      docType: 'CC',
      userNumber: '123456789',
      userRol: 'ADMIN',
      userName: 'John Doe',
      userPhone: '+57 328 4578',
      userMail: 'example@example.com',
      userPassword: 'a123',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      docType: 'CC',
      userNumber: '987654321',
      userRol: 'ADMIN',
      userName: 'Doe John',
      userPhone: '+57 328 4578',
      userMail: 'example@example.com',
      userPassword: 'qwertyuiop',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
