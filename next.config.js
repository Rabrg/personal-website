// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    env: {
        LITERAL_EMAIL: process.env.LITERAL_EMAIL,
        LITERAL_PASSWORD: process.env.LITERAL_PASSWORD,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.literal.club',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'i.gr-assets.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'http',
                hostname: 'books.google.com',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'lastfm.freetls.fastly.net',
                port: '',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'a.ltrbxd.com',
                port: '',
                pathname: '**',
            }
        ],
    },
}

module.exports = nextConfig