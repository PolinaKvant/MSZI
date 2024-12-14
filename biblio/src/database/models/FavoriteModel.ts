import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "..";

export interface FavoriteAttributes {
  id: number;
  userId: number;
  favorite: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type FavoriteCreationAttributes = Optional<FavoriteAttributes, "id">;

export class FavoriteModel extends Model<
  FavoriteAttributes,
  FavoriteCreationAttributes
> {
  declare id: number;
  declare userId: number;
  declare favorite: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

FavoriteModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    favorite: {
      type: DataTypes.STRING,
    },
  },
  { sequelize, tableName: "favorites" }
);

export default FavoriteModel;
