import { openLibraryApi } from "./openLibraryApi";
import { getBooksRequest, getBooksResponse, OpenLibraryBook } from "./types";

export const booksApi = openLibraryApi.injectEndpoints({
  endpoints: (builder) => ({
    apiGetBooks: builder.query<getBooksResponse, getBooksRequest>({
      query: ({ q, page, limit }) =>
        `/search.json?limit=${limit}&page=${page}${q ? `&q=${q}` : ""}`,
    }),

    apiGetBook: builder.query<OpenLibraryBook, string>({
      query: (id) => `/works/${id}.json`,
    }),
  }),
});

export const { useApiGetBooksQuery, useApiGetBookQuery } = booksApi;
