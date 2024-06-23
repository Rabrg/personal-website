import { LastFMUser } from 'lastfm-ts-api';

class LastFmAPI {
    private user: LastFMUser;

    constructor(api_key: string) {
        this.user = new LastFMUser(api_key);
    }

    async getTopArtists(username: string, limit: number = 8): Promise<any[]> {
        try {
            const response = await this.user.getTopArtists({
                user: username,
                limit: limit,
                period: '1month'
            });
            // console log response to see what it looks like
            console.log(response.topartists.artist[0]);
            return response.topartists.artist;
        } catch (error) {
            console.error('Error fetching top artists:', error);
            return [];
        }
    }
}

export default LastFmAPI;
