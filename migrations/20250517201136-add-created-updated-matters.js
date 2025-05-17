"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("matters", "createdAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn("matters", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("matters", "createdAt");
    await queryInterface.removeColumn("matters", "updatedAt");
  },
};
