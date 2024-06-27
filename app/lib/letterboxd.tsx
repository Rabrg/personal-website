import fetch from 'node-fetch';
import convert from 'xml-js';

interface FeedItem {
    title?: { _text?: string };
    link?: { _text?: string };
    guid?: { _text?: string };
    pubDate?: { _text?: string };
    'letterboxd:watchedDate'?: { _text?: string };
    'letterboxd:rewatch'?: { _text?: string };
    'letterboxd:filmTitle'?: { _text?: string };
    'letterboxd:filmYear'?: { _text?: string };
    'tmdb:movieId'?: { _text?: string };
    description?: { _cdata?: string };
    'dc:creator'?: { _text?: string };
}

interface Movie {
    title: string;
    link: string;
    guid: string;
    pubDate: Date | null;
    watchedDate: Date | null;
    rewatch: boolean;
    filmTitle: string;
    filmYear: string;
    tmdbId: string;
    description: string;
    creator: string;
    poster: string;
}

export default class LetterboxdAPI {
    private apiEndpoint: string;

    constructor() {
        this.apiEndpoint = 'https://letterboxd.com/ryangr/rss/';
    }

    async getMovies(): Promise<Movie[]> {
        const response = await fetch(this.apiEndpoint);
        const xml = await response.text();

        const result = JSON.parse(
            convert.xml2json(xml, {compact: true, spaces: 2})
        );
        const feed = result.rss.channel.item as FeedItem[];

        const movies = feed.map((item: FeedItem) => {
            const imageMatch = item.description?._cdata?.match(/<img src="([^"]+)"/) || [];
            const imageURL = imageMatch[1] || '';

            return {
                title: item.title?._text || '',
                link: item.link?._text || '',
                guid: item.guid?._text || '',
                pubDate: item.pubDate?._text ? new Date(item.pubDate._text) : null,
                watchedDate: item['letterboxd:watchedDate']?._text ? new Date(item['letterboxd:watchedDate']._text) : null,
                rewatch: item['letterboxd:rewatch']?._text?.toLowerCase() === 'yes',
                filmTitle: item['letterboxd:filmTitle']?._text || '',
                filmYear: item['letterboxd:filmYear']?._text || '',
                tmdbId: item['tmdb:movieId']?._text || '',
                description: item.description?._cdata || '',
                creator: item['dc:creator']?._text || '',
                poster: imageURL
            };
        });

        // Sort movies by watchedDate in descending order
        movies.sort((a, b) => {
            if (a.watchedDate && b.watchedDate) {
                return b.watchedDate.getTime() - a.watchedDate.getTime();
            }
            return 0;
        });

        return movies;
    }
}
