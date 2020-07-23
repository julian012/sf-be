'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Materials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      materialName: {
        type: Sequelize.STRING
      },
      materialRegistryDate: {
        type: Sequelize.DATE
      },
      materialQuantity: {
        type: Sequelize.DOUBLE
      },
      materialAvaliable: {
        type: Sequelize.DOUBLE
      },
      materialPrice: {
        type: Sequelize.DOUBLE
      },
      userId: {
        type: Sequelize.INTEGER
      },
      typeMaterialId: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Materials');
  }
};