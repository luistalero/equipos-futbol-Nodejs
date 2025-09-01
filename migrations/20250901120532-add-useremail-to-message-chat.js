'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('messages_chat', 'userEmail', {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'email',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize)  {
    await queryInterface.removeColumn('messages_chat', 'userEmail');
  }
};
