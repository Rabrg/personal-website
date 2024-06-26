import Image from 'next/image'
import {BlogPosts} from 'app/components/posts'
import LiteralAPI from 'app/lib/literal'
import LastFmAPI from 'app/lib/lastfm'
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Analytics} from "@vercel/analytics/react"
import LetterboxdAPI from 'app/lib/letterboxd'

async function getRecentMovies() {
    const api = new LetterboxdAPI();
    try {
        const movies = await api.getMovies();
        return movies.slice(0, 4);
    } catch (error) {
        console.error('Error fetching recent movies:', error);
        return [];
    }
}

async function getRecentBooks() {
    const api = new LiteralAPI();
    try {
        await api.login(process.env.LITERAL_EMAIL!, process.env.LITERAL_PASSWORD!);
        const {myReadingStates} = await api.getMyReadingStates();

        const books = await Promise.all(
            myReadingStates
                .filter(state => state.status === 'FINISHED' || state.status === 'IS_READING')
                .map(async state => {
                    if (state.status === 'IS_READING') {
                        return {...state, sortDate: new Date().toISOString()};
                    }
                    const {getReadDates} = await api.getReadDates(state.bookId, state.profileId);
                    const mostRecentReadDate = getReadDates
                        .filter(date => date.finished)
                        .sort((a, b) => new Date(b.finished!).getTime() - new Date(a.finished!).getTime())[0];
                    return {
                        ...state,
                        sortDate: mostRecentReadDate?.finished || mostRecentReadDate?.started || new Date(0).toISOString()
                    };
                })
        );

        return books
            .sort((a, b) => {
                if (a.status === 'IS_READING' && b.status !== 'IS_READING') return -1;
                if (a.status !== 'IS_READING' && b.status === 'IS_READING') return 1;
                return new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime();
            })
            .slice(0, 8);  // Changed from 4 to 8 to get 8 books
    } catch (error) {
        console.error('Error fetching recent books:', error);
        return [];
    }
}

async function getTopArtists() {
    const api = new LastFmAPI(process.env.LASTFM_API_KEY!);
    try {
        return await api.getTopArtists('ryangr69', 5);
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return [];
    }
}

export default async function Page() {
    const recentBooks = await getRecentBooks();
    const topArtists = await getTopArtists();
    const recentMovies = await getRecentMovies();

    return (
        <section>
            <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
                My Training Data
            </h1>
        {/*    <p className="mb-4">*/}
        {/*        {`I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in*/}
        {/*Vim's keystroke commands and tabs' flexibility for personal viewing*/}
        {/*preferences. This extends to my support for static typing, where its*/}
        {/*early error detection ensures cleaner code, and my preference for dark*/}
        {/*mode, which eases long coding sessions by reducing eye strain.`}*/}
        {/*    </p>*/}

            {recentBooks.length > 0 && (
                <>
                    <h2 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
                        Recently Read Books
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {recentBooks.map((state) => (
                            <div key={state.id} className="w-full">
                                <div className="relative w-full aspect-[2/3] mb-2">
                                    <Image
                                        src={state.book.cover || '/images/book-cover-placeholder.png'}
                                        alt={`Cover of ${state.book.title}`}
                                        fill
                                        style={{objectFit: 'cover'}}
                                        className="rounded-md"
                                    />
                                </div>
                                <p className="text-sm font-medium line-clamp-2">{state.book.title}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                                    {state.book.authors.map(a => a.name).join(', ')}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {recentMovies.length > 0 && (
                <>
                    <h2 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
                        Recently Watched Movies
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {recentMovies.map((movie) => (
                            <a
                                key={movie.guid}
                                href={movie.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block hover:opacity-80 transition-opacity cursor-pointer"
                            >
                                <div className="relative w-full aspect-[2/3] mb-2">
                                    <Image
                                        src={movie.poster || '/images/movie-poster-placeholder.png'}
                                        alt={`Poster of ${movie.filmTitle}`}
                                        fill
                                        style={{objectFit: 'cover'}}
                                        className="rounded-md"
                                    />
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <p className="text-sm font-medium line-clamp-2 flex-grow">{movie.filmTitle}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 ml-2">{movie.filmYear}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </>
            )}

            {topArtists.length > 0 && (
                <>
                    <h2 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
                        Recently Listened to Artists (Past Month)
                    </h2>
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

            <div className="my-8">
                <BlogPosts/>
            </div>
            <SpeedInsights/>
            <Analytics/>
        </section>
    )
}
