import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const openLibraryApi = createApi({
  reducerPath: "@@openLibraryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://openlibrary.org",
  }),
  endpoints: () => ({}), // Эндпоинты будут добавляться через injectEndpoints
});
