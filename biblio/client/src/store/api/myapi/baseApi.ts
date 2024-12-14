import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  credentials: "include", // Используем cookies для хранения токенов
  prepareHeaders: (headers) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Выполняем исходный запрос
  let result = await baseQuery(args, api, extraOptions);
  console.log(result);

  // Если получили 401 ошибку, пытаемся обновить токен
  //@ts-ignore
  if (result.error && result.error.originalStatus === 401) {
    // Отправляем запрос на обновление токена
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh",
        method: "GET",
      },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      window.location.href = "/auth";
      return refreshResult;
    } else {
      localStorage.setItem(
        "accessToken",
        //@ts-ignore
        refreshResult.data?.data?.tokens.accessToken
      );
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "@@baseApi",
  baseQuery: baseQueryWithReauth, // Используем наш настроенный baseQuery
  tagTypes: ["favorites"],
  endpoints: () => ({}), // Эндпоинты будут добавляться через injectEndpoints
});
