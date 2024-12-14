import { FC } from "react";
import "./Book.css";
import { OpenLibraryBook } from "../../store/api/openlibrary/types";
import { Button } from "@consta/uikit/Button";
import { IconBookmarkStroked } from "@consta/icons/IconBookmarkStroked";
import { useNavigate } from "react-router-dom";
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
} from "../../store/api/myapi";
import { toast } from "react-toastify";

interface Props {
  book: OpenLibraryBook;
}

const Book: FC<Props> = ({ book }) => {
  const navigate = useNavigate();

  // Извлекаем идентификатор работы (Work ID) из book.key
  const workId = book.key.split("/").at(-1);

  const [apiAddFavorite] = useAddFavoriteMutation();
  const [apiDeleteFavorite] = useDeleteFavoriteMutation();

  // Функция для формирования URL обложки
  const getCoverImageUrl = () => {
    if (book.cover_i) {
      // Если есть cover_i, используем его
      return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    } else if (book.cover_edition_key) {
      // Если есть cover_edition_key, используем его
      return `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`;
    } else if (book.isbn && book.isbn.length > 0) {
      // Если есть ISBN, используем первый
      return `https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-M.jpg`;
    } else {
      // Если обложка недоступна, используем изображение-заглушку
      return "/path/to/default-cover.jpg"; // Замените на путь к вашему изображению-заглушке
    }
  };

  const { data: favorites } = useGetFavoritesQuery();

  return (
    <div
      className="book"
      onClick={() => {
        navigate(`/book/${workId}`);
      }}
    >
      <img src={getCoverImageUrl()} alt="Обложка книги" className="book__img" />
      <div className="book__info">
        <div>
          <div className="book__tag">
            {book.subject ? book.subject[0] : "Не задано"}
          </div>
          <div className="book__name">{book.title}</div>
          <div className="book__author">
            {book.author_name ? book.author_name[0] : "Не задано"}
          </div>
        </div>
        <div className="book__footer">
          <Button
            iconLeft={IconBookmarkStroked}
            size="s"
            className={
              "book__btn" +
              (favorites?.includes(workId || "") ? " book__btn__active" : "")
            }
            onClick={(e) => {
              e.stopPropagation(); // Отменяем всплытие события
              if (favorites?.includes(workId || "")) {
                apiDeleteFavorite(workId || "").then(() => {
                  toast.success("Книга удалена из избранного");
                });
              } else {
                apiAddFavorite(workId || "").then(() => {
                  toast.success("Книга добавлена в избранное");
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Book;
