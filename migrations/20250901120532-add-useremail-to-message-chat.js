'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('messages_chat', 'userEmail', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'email',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('messages_chat', 'userEmail');
  }
};
