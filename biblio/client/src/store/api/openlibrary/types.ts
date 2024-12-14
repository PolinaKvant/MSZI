export interface OpenLibraryBook {
  key: string;
  type: string;
  title: string;
  title_suggest: string;
  edition_count: number;
  edition_key: string[];
  publish_date?: string[];
  publish_year?: number[];
  first_publish_year?: number;
  isbn?: string[];
  oclc?: string[];
  lccn?: string[];
  publisher?: string[];
  author_name?: string[];
  author_key?: string[];
  subject?: string[];
  language?: string[];
  id_alibris_id?: string[];
  id_amazon?: string[];
  id_goodreads?: string[];
  id_librarything?: string[];
  id_overdrive?: string[];
  id_wikidata?: string[];
  cover_edition_key?: string;
  cover_i?: number;
  seed?: string[];
  description?: any;
  subjects?: any;
  authors?: any;
  covers?: any;
}

export type getBooksRequest = {
  q: string;
  page: number;
  limit: number;
};

export type getBooksResponse = {
  numFound: number;
  docs: OpenLibraryBook[];
  numFoundExact: boolean;
  q: string;
};
