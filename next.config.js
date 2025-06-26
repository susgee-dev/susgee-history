/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'static-cdn.jtvnw.net' },
			{ protocol: 'https', hostname: 'cdn.7tv.app' }
		]
	}
};

module.exports = nextConfig;
