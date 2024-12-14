import { createBrowserRouter } from "react-router-dom";
import Main from "../pages/main";
import BookInfo from "../pages/bookInfo";
import Favorites from "../pages/favorites";
import Auth from "../pages/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/book/:id",
    element: <BookInfo />,
  },
  {
    path: "/favorites",
    element: <Favorites />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
]);

export default router;
