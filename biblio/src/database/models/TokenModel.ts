import { DataTypes, ForeignKey, Model, Optional } from "sequelize";
import { UserModel } from "./UserModel";
import sequelize from "..";

export interface TokenAttributes {
  id: number;
  token: string;
  userId: ForeignKey<UserModel["id"]>;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TokenCreationAttributes = Optional<TokenAttributes, "id">;

export class TokenModel extends Model<
  TokenAttributes,
  TokenCreationAttributes
> {
  declare id: number;
  declare token: string;
  declare userId: ForeignKey<UserModel["id"]>;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

TokenModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "tokens",
  }
);

export default TokenModel;
