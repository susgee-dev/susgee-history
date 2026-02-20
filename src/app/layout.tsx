import { Metadata } from 'next';
import { Outfit as Font } from 'next/font/google';
import Script from 'next/script';
import React from 'react';

import Footer from '@/components/footer';

import '@/styles/globals.css';

export const metadata: Metadata = {
	title: {
		default: 'Susgee History',
		template: '%s | susgee-dev'
	},
	description: 'Read recent messages from any Twitch channel displayed in a more readable format.',
	authors: [{ name: 'maersux', url: 'https://twitch.tv/maersux' }],
	publisher: 'susgee-dev',
	metadataBase: new URL('https://history.susgee.dev'),
	openGraph: {
		type: 'website',
		title: 'Twitch History viewer',
		description: 'Read recent messages from any Twitch channel displayed in a more readable format.',
		siteName: 'susgee-history',
		url: 'https://history.susgee.dev',
		images: [
			{
				url: 'https://emotes.susgee.dev/share_image.png',
				width: 800,
				height: 420,
				alt: 'Twitch History viewer'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Twitch History viewer',
		description: 'Read recent messages from any Twitch channel displayed in a more readable format.',
		images: [ 'https://emotes.susgee.dev/share_image.png' ],
	},
	other: {
		'darkreader-lock': ['darkreader-lock'],
		github: 'https://github.com/susgee-dev/susgee-history'
	}
};

const font = Font({
	subsets: ['latin']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			suppressHydrationWarning
			className={`${font.className} dark scroll-pt-4 scroll-smooth`}
			lang="en"
		>
			<body className="flex min-h-screen flex-col bg-gradient-bg bg-fixed text-font">
				<main className="mx-auto w-full max-w-[45rem] flex-1 p-4">{children}</main>
				<Footer />
				{process.env.TRACKING_ID && (
					<Script
					defer
					data-site-id={process.env.TRACKING_ID}
					src="https://track.susgee.dev/api/script.js"
					strategy="afterInteractive"
				/>
				)}
			</body>
		</html>
	);
}
