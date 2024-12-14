import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiGetBookQuery } from "../../store/api/openlibrary";
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
} from "../../store/api/myapi";
import { Button } from "@consta/uikit/Button";
import { IconBookmarkStroked } from "@consta/icons/IconBookmarkStroked";
import { toast } from "react-toastify";

const BookById: FC<{ book: string }> = ({ book }) => {
  const navigate = useNavigate();

  const { data: bookData } = useApiGetBookQuery(book || "", {
    skip: !book,
  });

  const { data: favorites } = useGetFavoritesQuery();

  const [bookCategory, setBookCategory] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthors, setBookAuthors] = useState("");
  const [bookCoverUrl, setBookCoverUrl] = useState("");

  const [apiAddFavorite] = useAddFavoriteMutation();
  const [apiDeleteFavorite] = useDeleteFavoriteMutation();

  useEffect(() => {
    async function fetchBookDetails() {
      if (!bookData) return;

      // Устанавливаем название книги
      setBookTitle(bookData.title || "Название недоступно");

      // Устанавливаем обложку книги
      if (bookData.covers && bookData.covers.length > 0) {
        const coverId = bookData.covers[0];
        setBookCoverUrl(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
      } else {
        setBookCoverUrl("/path/to/default-cover.jpg"); // Замените на путь к вашему изображению-заглушке
      }

      // Устанавливаем категории и теги
      const categories = bookData.subjects || [];
      const category =
        categories.length > 0 ? categories[0] : "Категория недоступна";
      setBookCategory(category);

      // Получаем имя автора
      if (bookData.authors && bookData.authors.length > 0) {
        const authorKey = bookData.authors[0].author.key;
        const authorName = await fetchAuthorName(authorKey);
        setBookAuthors(authorName);
      } else {
        setBookAuthors("Автор неизвестен");
      }
    }

    fetchBookDetails();
  }, [bookData]);

  // Функция для получения имени автора
  async function fetchAuthorName(authorKey: string): Promise<string> {
    try {
      const response = await fetch(`https://openlibrary.org${authorKey}.json`);
      const data = await response.json();
      return data.name || "Имя автора недоступно";
    } catch (error) {
      console.error("Ошибка при получении данных автора:", error);
      return "Имя автора недоступно";
    }
  }

  return (
    <div
      className="book"
      onClick={() => {
        navigate(`/book/${book}`);
      }}
    >
      <img src={bookCoverUrl} alt="Обложка книги" className="book__img" />
      <div className="book__info">
        <div>
          <div className="book__tag">
            {bookCategory ? bookCategory : "Не задано"}
          </div>
          <div className="book__name">{bookTitle || "Название недоступно"}</div>
          <div className="book__author">
            {bookAuthors ? bookAuthors : "Не задано"}
          </div>
        </div>
        <div className="book__footer">
          <Button
            iconLeft={IconBookmarkStroked}
            size="s"
            className={
              "book__btn" +
              (favorites?.includes(book || "") ? " book__btn__active" : "")
            }
            onClick={(e) => {
              e.stopPropagation(); // Отменяем всплытие события
              if (favorites?.includes(book || "")) {
                apiDeleteFavorite(book || "").then(() => {
                  toast.success("Книга удалена из избранного");
                });
              } else {
                apiAddFavorite(book || "").then(() => {
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

export default BookById;
