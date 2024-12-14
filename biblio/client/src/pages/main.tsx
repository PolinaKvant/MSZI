import { useEffect, useState } from "react";
import Header from "../components/Header";
import Search from "../components/Search";
import useCheckAuth from "../hooks/useCheckAuth";
import { useApiGetBooksQuery } from "../store/api/openlibrary";
import "./page.css";
import { OpenLibraryBook } from "../store/api/openlibrary/types";
import Book from "../components/Book";
import { Text } from "@consta/uikit/Text";
import { Button } from "@consta/uikit/Button";
import { IconBackward } from "@consta/icons/IconBackward";
import { IconForward } from "@consta/icons/IconForward";

function Main() {
  useCheckAuth();

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);

  const { data, isFetching: isLoadingBooks } = useApiGetBooksQuery(
    {
      q: searchValue,
      limit: 6,
      page: page,
    },
    {
      skip: !searchValue,
    }
  );

  const [books, setBooks] = useState<OpenLibraryBook[]>([]);

  useEffect(() => {
    if (!data) return;
    setBooks(data.docs);
  }, [data]);

  return (
    <div className="container">
      <Header />
      <Search setValue={setSearchValue} />
      {books.length && !isLoadingBooks ? (
        <Text>Найдено книг – {data?.numFound}</Text>
      ) : null}
      <div className="booksContainer">
        {isLoadingBooks ? (
          <Text>Загрузка...</Text>
        ) : books.length ? (
          <>
            {books.map((book) => (
              <Book key={book.key} book={book} />
            ))}
          </>
        ) : searchValue ? (
          <Text>Ничего не найдено</Text>
        ) : (
          <Text>Введите название книги</Text>
        )}
      </div>
      <div className="footer">
        <Button
          iconLeft={IconBackward}
          onClick={() => {
            setPage(page - 1);
          }}
          disabled={page === 1}
          label="Предыдущая страница"
          className="footer__btn"
        />
        <Button
          iconRight={IconForward}
          onClick={() => {
            setPage(page + 1);
          }}
          disabled={!data || data.numFound / 6 <= page}
          label="Следующая страница"
          className="footer__btn"
        />
      </div>
    </div>
  );
}

export default Main;
