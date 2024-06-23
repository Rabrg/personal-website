import Image from 'next/image'
import {BlogPosts} from 'app/components/posts'
import LiteralAPI from 'app/lib/literal'
import LastFmAPI from 'app/lib/lastfm'

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
        return await api.getTopArtists('ryangr69', 8);
    } catch (error) {
        console.error('Error fetching top artists:', error);
        return [];
    }
}

export default async function Page() {
    const recentBooks = await getRecentBooks();
    const topArtists = await getTopArtists();

    return (
        <section>
            <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
                My Portfolio
            </h1>
            <p className="mb-4">
                {`I'm a Vim enthusiast and tab advocate, finding unmatched efficiency in
        Vim's keystroke commands and tabs' flexibility for personal viewing
        preferences. This extends to my support for static typing, where its
        early error detection ensures cleaner code, and my preference for dark
        mode, which eases long coding sessions by reducing eye strain.`}
            </p>

            <h2 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
                Recent Books
            </h2>
            {recentBooks.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                    {recentBooks.map((state) => (
                        <div key={state.id} className="w-32">
                            <div className="relative w-32 h-48 mb-2">
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
            ) : (
                <p>No recent books found.</p>
            )}

            <h2 className="mt-8 mb-4 text-xl font-semibold tracking-tighter">
                Top Artists (Last Month)
            </h2>
            {topArtists.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                    {topArtists.map((artist) => (
                        <div key={artist.mbid} className="w-32">
                            <div className="relative w-32 h-32 mb-2">
                                <Image
                                    src={artist.image[0]['#text']} // Use medium-sized image
                                    alt={`${artist.name}`}
                                    fill
                                    style={{objectFit: 'cover'}}
                                    className="rounded-md"
                                />
                            </div>
                            <p className="text-sm font-medium line-clamp-2">{artist.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {artist.playcount} plays
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No top artists found.</p>
            )}

            <div className="my-8">
                <BlogPosts/>
            </div>
        </section>
    )
}
