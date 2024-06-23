import axios, { AxiosInstance } from 'axios';

// Define types for the API responses
interface Profile {
    id: string;
    handle: string;
    name: string;
    bio: string;
    image: string;
    invitedByProfileId?: string;
}

interface Author {
    id: string;
    name: string;
}

interface Book {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    description?: string;
    isbn10?: string;
    isbn13?: string;
    language: string;
    pageCount?: number;
    publishedDate?: string;
    publisher?: string;
    cover?: string;
    authors: Author[];
    gradientColors: string[];
}

interface ReadingState {
    id: string;
    status: 'WANTS_TO_READ' | 'IS_READING' | 'FINISHED' | 'DROPPED' | 'NONE';
    bookId: string;
    profileId: string;
    createdAt: string;
    book: Book;
}

interface Highlight {
    id: string;
    note?: string;
    noteJson?: string;
    quote?: string;
    quoteJson?: string;
    where?: string;
    spoiler: boolean;
    profileId: string;
    bookId: string;
    createdAt: string;
    profile: Profile;
}

interface ReadDate {
    id: string;
    started?: string;
    finished?: string;
    followingStatus: string;
    updatedAt: string;
    createdAt: string;
}

interface Review {
    id: string;
    rating: number;
    spoiler: boolean;
    text?: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
}

interface Shelf {
    id: string;
    slug: string;
    title: string;
    description?: string;
    profileId: string;
    owner: Profile;
    books: Book[];
}

class LiteralAPI {
    private axiosInstance: AxiosInstance;
    private token: string | null = null;

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: 'https://literal.club/graphql/',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    private async executeQuery<T>(query: string, variables: any = {}): Promise<T> {
        if (this.token) {
            this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await this.axiosInstance.post('', {
            query,
            variables,
        });

        return response.data.data;
    }

    async login(email: string, password: string): Promise<{ token: string; email: string; languages: string[]; profile: Profile }> {
        const query = `
      mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          email
          languages
          profile {
            id
            handle
            name
            bio
            image
          }
        }
      }
    `;

        const result = await this.executeQuery<{ login: { token: string; email: string; languages: string[]; profile: Profile } }>(query, { email, password });
        this.token = result.login.token;
        return result.login;
    }

    async getMyReadingStates(): Promise<{ myReadingStates: ReadingState[] }> {
        const query = `
      query myReadingStates {
        myReadingStates {
          id
          status
          bookId
          profileId
          createdAt
          book {
            id
            slug
            title
            subtitle
            description
            isbn10
            isbn13
            language
            pageCount
            publishedDate
            publisher
            cover
            authors {
              id
              name
            }
            gradientColors
          }
        }
      }
    `;

        return this.executeQuery<{ myReadingStates: ReadingState[] }>(query);
    }

    async updateReadingState(bookId: string, readingStatus: 'WANTS_TO_READ' | 'IS_READING' | 'FINISHED' | 'DROPPED' | 'NONE'): Promise<{ updateReadingState: ReadingState }> {
        const query = `
      mutation updateReadingState($bookId: String!, $readingStatus: ReadingStatus!) {
        updateReadingState(bookId: $bookId, readingStatus: $readingStatus) {
          id
          status
          bookId
          profileId
          createdAt
          book {
            id
            slug
            title
            subtitle
            description
            isbn10
            isbn13
            language
            pageCount
            publishedDate
            publisher
            cover
            authors {
              id
              name
            }
            gradientColors
          }
        }
      }
    `;

        return this.executeQuery<{ updateReadingState: ReadingState }>(query, { bookId, readingStatus });
    }

    async getMyBooks(): Promise<{ myBooks: Book[] }> {
        const query = `
      query myBooks {
        myBooks {
          id
          slug
          title
          subtitle
          description
          isbn10
          isbn13
          language
          pageCount
          publishedDate
          publisher
          cover
          authors {
            id
            name
          }
          gradientColors
        }
      }
    `;

        return this.executeQuery<{ myBooks: Book[] }>(query);
    }

    async getHighlights(bookId: string, handle?: string): Promise<{ momentsByHandleAndBookId: Highlight[] }> {
        const query = `
      query momentsByHandleAndBookId($bookId: String!, $handle: String) {
        momentsByHandleAndBookId(bookId: $bookId, handle: $handle) {
          id
          note
          noteJson
          quote
          quoteJson
          where
          spoiler
          profileId
          bookId
          createdAt
          profile {
            id
            handle
            name
            bio
            image
            invitedByProfileId
          }
        }
      }
    `;

        return this.executeQuery<{ momentsByHandleAndBookId: Highlight[] }>(query, { bookId, handle });
    }

    async getReadDates(bookId: string, profileId: string): Promise<{ getReadDates: ReadDate[] }> {
        const query = `
      query getReadDates($bookId: String!, $profileId: String!) {
        getReadDates(bookId: $bookId, profileId: $profileId) {
          id
          started
          finished
          followingStatus
          updatedAt
          createdAt
        }
      }
    `;

        return this.executeQuery<{ getReadDates: ReadDate[] }>(query, { bookId, profileId });
    }

    async createReview(bookId: string, text: string | null, spoiler: boolean, rating: number, tags: string[]): Promise<{ createReview: Review }> {
        const query = `
      mutation createReview($bookId: String!, $text: String, $spoiler: Boolean!, $rating: Float!, $tags: [String!]) {
        createReview(bookId: $bookId, text: $text, spoiler: $spoiler, rating: $rating, tags: $tags) {
          id
          rating
          spoiler
          text
          createdAt
          updatedAt
          tags
        }
      }
    `;

        return this.executeQuery<{ createReview: Review }>(query, { bookId, text, spoiler, rating, tags });
    }

    async updateReview(id: string, text: string | null, spoiler: boolean, rating: number, tags: string[]): Promise<{ updateReview: Review }> {
        const query = `
      mutation updateReview($id: String!, $text: String, $spoiler: Boolean!, $rating: Float!, $tags: [String!]) {
        updateReview(id: $id, text: $text, spoiler: $spoiler, rating: $rating, tags: $tags) {
          id
          rating
          spoiler
          text
          createdAt
          updatedAt
          tags
        }
      }
    `;

        return this.executeQuery<{ updateReview: Review }>(query, { id, text, spoiler, rating, tags });
    }

    async createHighlight(note: string | null, quote: string | null, spoiler: boolean | null, bookId: string, where: string | null): Promise<{ createMoment: Highlight }> {
        const query = `
      mutation createMoment($note: String, $quote: String, $spoiler: Boolean, $bookId: String!, $where: String) {
        createMoment(note: $note, quote: $quote, spoiler: $spoiler, bookId: $bookId, where: $where) {
          id
          note
          noteJson
          quote
          quoteJson
          where
          spoiler
          profileId
          bookId
          createdAt
        }
      }
    `;

        return this.executeQuery<{ createMoment: Highlight }>(query, { note, quote, spoiler, bookId, where });
    }

    async getShelfBySlug(shelfSlug: string): Promise<{ shelf: Shelf }> {
        const query = `
      query getShelfBySlug($shelfSlug: String!) {
        shelf(where: { slug: $shelfSlug }) {
          id
          slug
          title
          description
          profileId
          owner {
            id
            handle
            name
            bio
            image
            invitedByProfileId
          }
          books {
            id
            slug
            title
            subtitle
            description
            isbn10
            isbn13
            language
            pageCount
            publishedDate
            publisher
            cover
            authors {
              id
              name
            }
            gradientColors
          }
        }
      }
    `;

        return this.executeQuery<{ shelf: Shelf }>(query, { shelfSlug });
    }

    async getShelvesByProfileId(profileId: string, limit: number, offset: number): Promise<{ getShelvesByProfileId: Shelf[] }> {
        const query = `
      query getShelvesByProfileId($profileId: String!, $limit: Int!, $offset: Int!) {
        getShelvesByProfileId(profileId: $profileId, limit: $limit, offset: $offset) {
          id
          slug
          title
          description
          profileId
          books(take: 3) {
            id
            slug
            title
            subtitle
            description
            isbn10
            isbn13
            language
            pageCount
            publishedDate
            publisher
            cover
            authors {
              id
              name
            }
            gradientColors
          }
        }
      }
    `;

        return this.executeQuery<{ getShelvesByProfileId: Shelf[] }>(query, { profileId, limit, offset });
    }

    async getBooksByReadingStateAndProfile(limit: number, offset: number, readingStatus: 'WANTS_TO_READ' | 'IS_READING' | 'FINISHED' | 'DROPPED' | 'NONE', profileId: string): Promise<{ booksByReadingStateAndProfile: Book[] }> {
        const query = `
      query booksByReadingStateAndProfile($limit: Int!, $offset: Int!, $readingStatus: ReadingStatus!, $profileId: String!) {
        booksByReadingStateAndProfile(limit: $limit, offset: $offset, readingStatus: $readingStatus, profileId: $profileId) {
          id
          slug
          title
          subtitle
          description
          isbn10
          isbn13
          language
          pageCount
          publishedDate
          publisher
          cover
          authors {
            id
            name
          }
          gradientColors
        }
      }
    `;

        return this.executeQuery<{ booksByReadingStateAndProfile: Book[] }>(query, { limit, offset, readingStatus, profileId });
    }

    async getProfileByHandle(handle: string): Promise<{ profile: Profile }> {
        const query = `
      query getProfileParts($handle: String!) {
        profile(where: { handle: $handle }) {
          id
          handle
          name
          bio
          image
          invitedByProfileId
        }
      }
    `;

        return this.executeQuery<{ profile: Profile }>(query, { handle });
    }

    async getBookByIsbn(isbn13: string): Promise<{ book: Book }> {
        const query = `
      query GetBookByIsbn($isbn13: String!) {
        book(where: {isbn13: $isbn13}) {
          id
          slug
          title
          subtitle
          description
          isbn10
          isbn13
          language
          pageCount
          publishedDate
          publisher
          cover
          authors {
            id
            name
          }
          gradientColors
        }
      }
    `;

        return this.executeQuery<{ book: Book }>(query, { isbn13 });
    }
}

export default LiteralAPI;
