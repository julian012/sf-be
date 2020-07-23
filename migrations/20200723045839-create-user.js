'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('User', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      docType: {
        type: Sequelize.ENUM(['CC','NIT']),
        allowNull: false,
      },
      userNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userRol: {
        type: Sequelize.ENUM(['ADMIN','WORKER','PROVIDER','DIRECTOR']),
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userMail: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      userPassword: {
        type: Sequelize.STRING,
        allowNull: true,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('User');
  }
};
