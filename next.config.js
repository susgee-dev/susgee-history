/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [new URL('https://static-cdn.jtvnw.net/**')]
	}
};

module.exports = nextConfig;
