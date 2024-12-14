import { DataTypes, Model, Optional } from "sequelize";
import { TokenModel } from "./TokenModel";
import sequelize from "..";
import FavoriteModel from "./FavoriteModel";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, "id">;

export class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, tableName: "users" }
);

UserModel.hasOne(TokenModel, { sourceKey: "id", foreignKey: "userId" });
UserModel.hasMany(FavoriteModel, { sourceKey: "id", foreignKey: "userId" });

export default UserModel;
