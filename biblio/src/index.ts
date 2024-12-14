import express from "express";
import dotenv from "dotenv";
import sequelize from "@/database";
import UserModel from "@/database/models/UserModel";
import TokenModel from "@/database/models/TokenModel";
import errorMiddleware from "./middlewares/errorMiddleware";
import authRouter from "./routers/authRouter";
import favoriteRouter from "./routers/favoriteRouter";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const { PORT } = process.env;

const app = express(); //построение сервера

const whiteList = ["http://localhost:3000", "http://localhost:5173", undefined];

app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null);
      }
    },
  })
);

//@ts-ignore
app.use(errorMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);
app.use("/favorite", favoriteRouter);

async function StartServer() {
  try {
    console.log("Try to connect to database");
    await sequelize.authenticate();
    console.log("Connected to database");

    console.log("Try to sync database");
    await sequelize.sync();
    await UserModel.sync();
    await TokenModel.sync();
    console.log("Database synced");

    console.log("Try to start server");
    await app.listen(parseInt(PORT || "3000"));
    console.log(`Server started on port ${PORT || 3000}`);
  } catch (error) {
    console.error(error);
  }
}

StartServer();
