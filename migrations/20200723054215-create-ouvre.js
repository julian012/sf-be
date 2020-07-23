'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Ouvres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ouvreName: {
        type: Sequelize.STRING
      },
      ouvreDirection: {
        type: Sequelize.STRING
      },
      ouvreStartDate: {
        type: Sequelize.DATE
      },
      ouvreEndDate: {
        type: Sequelize.DATE
      },
      statusOuvre: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('Ouvres');
  }
};