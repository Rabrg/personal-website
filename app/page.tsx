import Image from 'next/image'
import {BlogPosts} from 'app/components/posts'
import LastFmAPI from 'app/lib/lastfm'
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Analytics} from "@vercel/analytics/react"
import Bio from 'app/components/bio'
import cheerio, { load } from 'cheerio';

import LetterboxdAPI from 'app/lib/letterboxd'

async function getRecentMovies() {
    const api = new LetterboxdAPI();
    try {
        const movies = await api.getMovies();
        // Print the title and rating of all movies
        console.log("Movie - Rating (0-5)")
        movies.forEach(movie => {
            console.log(`${movie.title} - ${movie.rating}`);
        });
        return movies.filter(movie => movie.rating >= 4).slice(0, 8);
    } catch (error) {
        console.error('Error fetching recent movies:', error);
        return [];
    }
}

async function getRecentBooks() {
    const url = 'https://www.goodreads.com/review/list/81182829?shelf=read&sort=date_read&per_page=100';
  
    const response = await fetch(url);
    const html = await response.text();
    const $ = load(html);
  
    const books: {
      title: string;
      authors: string[];
      cover: string;
    }[] = [];
  
    $('tr.bookalike.review').each((_, el) => {
      let title = $(el).find('td.field.title div.value a').text().trim();
      let cover = $(el).find('td.field.cover div.value img').attr('src') || '/images/book-cover-placeholder.png';
  
      const authors = $(el)
        .find('td.field.author div.value a')
        .map((_, authorEl) => $(authorEl).text().trim())
        .get();
  
      if (title.includes(':')) {
        title = title.split(':')[0];
      }
  
      // Transform the cover URL into a higher-quality version
      if (cover.includes('_SY75_.')) {
        cover = cover.replace('_SY75_.', '');
      }
  
      if (
        title &&
        !title.includes("Plato") &&
        !title.includes("Wabi-Sabi")
      ) {
        books.push({
          title,
          authors,
          cover,
        });
      }
    });

    // Print all titles and authors
    console.log("Book - Author")
    books.forEach(book => {
        console.log(`${book.title} - ${book.authors.join(', ')}`);
    });
  
    return books.slice(0, 8);
  }
  

async function getTopArtists() {
    console.log("lastfmapikey ", process.env.LASTFM_API_KEY)
    const api = new LastFmAPI(process.env.LASTFM_API_KEY!);
    try {
        return await api.getTopArtists('ryangr69', 16).then(artists => artists.slice(0, 7));
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return [];
    }
}

export default async function Page() {
    const recentBooks = await getRecentBooks();
    console.log()
    const topArtists = await getTopArtists();
    console.log()
    const recentMovies = await getRecentMovies();
  
    return (
      <section>
        <h2 className="mb-8 text-2xl font-semibold tracking-tighter">
          Muses
        </h2>
  
        {recentBooks.length > 0 && (
          <>
            {/* <p className="mb-4">Below are examples from my personal training dataset, aggregated from my Goodreads, Letterboxd, and Last.fm accounts.</p> */}

            <h3 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
              Recently Read Books
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recentBooks.map((book, index) => (
                <div key={index} className="w-full">
                  <div className="relative w-full aspect-[2/3] mb-2">
                    <Image
                      src={book.cover}
                      alt={`Cover of ${book.title}`}
                      fill
                      style={{objectFit: 'cover'}}
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{book.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {book.authors.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
  
        {recentMovies.length > 0 && (
          <>
            <h3 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
              Recently Watched Movies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {recentMovies.map((movie, index) => (
                <div key={index} className="w-full">
                  <div className="relative w-full aspect-[2/3] mb-2">
                    <Image
                      src={movie.poster}
                      alt={`Cover of ${movie.title}`}
                      fill
                      style={{objectFit: 'cover'}}
                      className="rounded-md"
                    />
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{movie.title}</p>
                  {/* <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {movie.filmYear}
                  </p> */}
                </div>
              ))}
            </div>
          </>
        )}

        {topArtists.length > 0 && (
          <>
            <h3 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
              Recently Listened to Artists
            </h3>
            <div className="space-y-4">
              {topArtists.map((artist) => (
                <div key={artist.mbid} className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm font-medium">{artist.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{artist.playcount} plays</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full"
                         style={{width: `${(artist.playcount / topArtists[0].playcount) * 100}%`}}></div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
  
        {/* <h2 className="mt-12 mb-8 text-2xl font-semibold tracking-tighter">
          Musings
        </h2>
  
        <div className="my-8">
          <BlogPosts/>
        </div> */}
  
        <SpeedInsights/>
        <Analytics/>
      </section>
    )
  }
