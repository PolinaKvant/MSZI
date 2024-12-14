import FavoriteModel from "@/database/models/FavoriteModel";
import ApiError from "@/exceptions/apiError";

export default class FavoriteService {
  static async getFavorites(userId: number) {
    const favorites = await FavoriteModel.findAll({ where: { userId } });
    return favorites.map((favorite) => favorite.favorite);
  }

  static async addFavorite(userId: number, favorite: string) {
    const favoriteExists = await FavoriteModel.findOne({
      where: { userId, favorite },
    });
    if (favoriteExists)
      return ApiError.BadRequest("Такой фаворит уже существует");
    return await FavoriteModel.create({ userId, favorite });
  }

  static async deleteFavorite(userId: number, favorite: string) {
    const favoriteExists = await FavoriteModel.findOne({
      where: { userId, favorite },
    });
    if (!favoriteExists) return ApiError.BadRequest("Нет такого фаворита");
    return await FavoriteModel.destroy({ where: { userId, favorite } });
  }
}
