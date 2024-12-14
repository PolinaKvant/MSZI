// BookInfo.tsx
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import useCheckAuth from "../hooks/useCheckAuth";
import { useApiGetBookQuery } from "../store/api/openlibrary";
import { useEffect, useState } from "react";
import { Button } from "@consta/uikit/Button";
import {
  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
} from "../store/api/myapi";
import { toast } from "react-toastify";

const BookInfo = () => {
  useCheckAuth();
  const { id } = useParams();

  const { data: favorites } = useGetFavoritesQuery();

  // Получаем данные книги по идентификатору работы (work ID)
  const {
    data: bookData,
    isLoading,
    error,
  } = useApiGetBookQuery(id || "", {
    skip: !id,
  });

  const [apiAddFavorite] = useAddFavoriteMutation();
  const [apiDeleteFavorite] = useDeleteFavoriteMutation();

  // Состояния для хранения данных книги
  const [bookTitle, setBookTitle] = useState("");
  const [bookCoverUrl, setBookCoverUrl] = useState("");
  const [bookAuthors, setBookAuthors] = useState("");
  const [bookCategory, setBookCategory] = useState("");
  const [bookFirstPublished, setBookFirstPublished] = useState("");
  const [bookCountPages, setBookCountPages] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookTags, setBookTags] = useState<string[]>([]);

  useEffect(() => {
    async function fetchBookDetails() {
      if (!bookData) return;

      const workKey = bookData.key;

      // Устанавливаем название книги
      setBookTitle(bookData.title || "Название недоступно");

      // Устанавливаем обложку книги
      if (bookData.covers && bookData.covers.length > 0) {
        const coverId = bookData.covers[0];
        setBookCoverUrl(`https://covers.openlibrary.org/b/id/${coverId}-L.jpg`);
      } else {
        setBookCoverUrl("/path/to/default-cover.jpg"); // Замените на путь к вашему изображению-заглушке
      }

      // Устанавливаем описание книги
      if (typeof bookData.description === "string") {
        setBookDescription(bookData.description);
      } else if (
        bookData.description &&
        typeof bookData.description.value === "string"
      ) {
        setBookDescription(bookData.description.value);
      } else {
        setBookDescription("Описание недоступно");
      }

      // Устанавливаем категории и теги
      const categories = bookData.subjects || [];
      const category =
        categories.length > 0 ? categories[0] : "Категория недоступна";
      setBookCategory(category);
      setBookTags(categories);

      // Получаем имя автора
      if (bookData.authors && bookData.authors.length > 0) {
        const authorKey = bookData.authors[0].author.key;
        const authorName = await fetchAuthorName(authorKey);
        setBookAuthors(authorName);
      } else {
        setBookAuthors("Автор неизвестен");
      }

      // Получаем дату первой публикации
      const firstPublicationDate = await fetchFirstPublicationDate(workKey);
      setBookFirstPublished(firstPublicationDate);

      // Получаем число страниц
      const numberOfPages = await fetchNumberOfPages(workKey);
      setBookCountPages(numberOfPages);
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

  // Функция для получения даты первой публикации
  async function fetchFirstPublicationDate(workKey: string): Promise<string> {
    try {
      const response = await fetch(
        `https://openlibrary.org${workKey}/editions.json?limit=100`
      );
      const data = await response.json();
      const editions = data.entries || [];

      let earliestDate: Date | null = null;

      editions.forEach((edition: any) => {
        if (edition.publish_date) {
          const dateStr = edition.publish_date;
          const date = new Date(dateStr);

          if (!isNaN(date.getTime())) {
            if (!earliestDate || date < earliestDate) {
              earliestDate = date;
            }
          }
        }
      });

      return earliestDate
        ? (earliestDate as Date).getFullYear().toString()
        : "Дата публикации недоступна";
    } catch (error) {
      console.error("Ошибка при получении данных изданий:", error);
      return "Дата публикации недоступна";
    }
  }

  // Функция для получения числа страниц
  async function fetchNumberOfPages(workKey: string): Promise<string> {
    try {
      const response = await fetch(
        `https://openlibrary.org${workKey}/editions.json?limit=1`
      );
      const data = await response.json();
      const editions = data.entries || [];

      if (editions.length > 0 && editions[0].number_of_pages) {
        return editions[0].number_of_pages.toString();
      } else {
        return "Количество страниц недоступно";
      }
    } catch (error) {
      console.error("Ошибка при получении данных изданий:", error);
      return "Количество страниц недоступно";
    }
  }

  if (isLoading) return <div className="container">Загрузка...</div>;
  if (error) return <div className="container">Ошибка при загрузке данных</div>;

  return (
    <div className="container">
      <Header />
      <div className="bookinfo__container">
        <div className="bookinfo_wrapper">
          <img
            src={bookCoverUrl}
            alt="Обложка книги"
            className="bookinfo_img"
          />
          <div className="bookinfo__info">
            <h1>{bookTitle}</h1>
            <p>
              Автор: <b>{bookAuthors}</b>
            </p>
            <p>
              Категория: <b>{bookCategory}</b>
            </p>
            <p>
              Первая публикация: <b>{bookFirstPublished}</b>
            </p>
            <p>
              Число страниц: <b>{bookCountPages}</b>
            </p>
            <Button
              label={
                favorites?.includes(id || "")
                  ? "Удалить из избранного"
                  : "Добавить в избранное"
              }
              className="bookinfo__button"
              onClick={(e) => {
                e.stopPropagation(); // Отменяем всплытие события
                if (favorites?.includes(id || "")) {
                  apiDeleteFavorite(id || "").then(() => {
                    toast.success("Книга удалена из избранного");
                  });
                } else {
                  apiAddFavorite(id || "").then(() => {
                    toast.success("Книга добавлена в избранное");
                  });
                }
              }}
            />
          </div>
        </div>
        <div>
          <p>
            <b>Описание:</b>
          </p>
          <p>{bookDescription}</p>
        </div>
        <p>
          <b>Тэги:</b>
        </p>
        <div className="bookinfo__tags">
          {bookTags.map((tag, index) => (
            <div key={index} className="bookinfo__tag">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookInfo;
