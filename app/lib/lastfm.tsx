import {LastFMBooleanNumber, LastFMUser} from 'lastfm-ts-api';

interface ArtistImage {
    '#text': string;
    size: string;
}

interface Artist {
    streamable: LastFMBooleanNumber;
    image: ArtistImage[];
    mbid: string;
    url: string;
    playcount: number;
    '@attr': { rank: number };
    name: string;
}

interface TopArtistsResponse {
    topartists: {
        artist: Artist[];
    };
}

class LastFmAPI {
    private user: LastFMUser;

    constructor(api_key: string) {
        this.user = new LastFMUser(api_key);
    }

    async getTopArtists(username: string, limit: number = 8): Promise<Artist[]> {
        try {
            const response = await this.user.getTopArtists({
                user: username,
                limit: limit,
                period: '1month'
            });

            // Type assertion to match our expected structure
            const typedResponse = response as unknown as TopArtistsResponse;

            console.log(typedResponse.topartists.artist[0]);
            return typedResponse.topartists.artist;
        } catch (error) {
            console.error('Error fetching top artists:', error);
            return [];
        }
    }
}

export default LastFmAPI;
export type {Artist};