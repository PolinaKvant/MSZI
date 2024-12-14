import BookById from "../components/BookById";
import Header from "../components/Header";
import useCheckAuth from "../hooks/useCheckAuth";
import { useGetFavoritesQuery } from "../store/api/myapi";
import { Text } from "@consta/uikit/Text";

function Favorites() {
  useCheckAuth();
  const { data: favorites, isLoading } = useGetFavoritesQuery();

  return (
    <div className="container">
      <Header />
      <div className="booksContainer">
        {isLoading ? (
          <Text>Загрузка...</Text>
        ) : favorites?.length ? (
          favorites.map((book) => <BookById key={book} book={book} />)
        ) : (
          <Text>Нет избранных книг</Text>
        )}
      </div>
    </div>
  );
}

export default Favorites;
