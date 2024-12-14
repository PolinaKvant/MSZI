import { baseApi } from "./baseApi";

export const myApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<loginResponse, loginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<loginResponse, registerRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.query<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "GET",
      }),
    }),

    refresh: builder.query<void, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
    }),

    me: builder.query<meResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),

    getFavorites: builder.query<string[], void>({
      query: () => ({
        url: "/favorite",
        method: "GET",
      }),
      providesTags: ["favorites"],
    }),

    addFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/favorite`,
        method: "POST",
        body: {
          favorite: id,
        },
      }),
      invalidatesTags: ["favorites"],
    }),

    deleteFavorite: builder.mutation<void, string>({
      query: (id) => ({
        url: `/favorite`,
        method: "DELETE",
        body: {
          favorite: id,
        },
      }),
      invalidatesTags: ["favorites"],
    }),
  }),
});

export const {
  useLoginMutation,

  useRegisterMutation,

  useLogoutQuery,
  useLazyLogoutQuery,

  useRefreshQuery,
  useLazyRefreshQuery,

  useMeQuery,
  useLazyMeQuery,

  useAddFavoriteMutation,
  useDeleteFavoriteMutation,
  useGetFavoritesQuery,
  useLazyGetFavoritesQuery,
} = myApi;

export interface meResponse {
  message: string;
  data: UserInfo;
}

export interface loginRequest {
  email: string;
  password: string;
}

export interface registerRequest {
  email: string;
  password: string;
  name: string;
}
export interface loginResponse {
  message: string;
  data: UserData;
}

export interface UserData {
  tokens: Tokens;
  data: UserInfo;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserInfo {
  id: number;
  name: string;
  email: string;
}
