import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const sequelize = new Sequelize(
  DB_NAME || "postgres",
  DB_USER || "postgres",
  DB_PASSWORD || "",
  {
    host: DB_HOST || "localhost",
    port: parseInt(DB_PORT || "5432"),
    dialect: "postgres",
    // logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export default sequelize;
