import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV !== "development";

const sequelize = new Sequelize(
  process.env.DB_NAME || "law_firm_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "postgres",
  {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    dialect: "postgres",
    dialectOptions: isProduction
      ? {
          ssl: {
            rejectUnauthorized: false,
          },
        }
      : undefined,
    logging: isProduction ? false : console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
