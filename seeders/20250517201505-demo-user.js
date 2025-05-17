"use strict";

const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        id: uuidv4(),
        email: "test@test.com",
        password:
          "$2a$10$NyuYV6qYsS5YSXnpCuUikO.Z6SdVvXmmr242mP1V3f4QB2oefiMCK", // 12345678
        firmName: "Test Firm",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", {
      email: "test@test.com",
    });
  },
};
