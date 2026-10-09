import { Metadata } from 'next';
import { Outfit as Font, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import React from 'react';

import Footer from '@/components/footer';
import MotionProvider from '@/components/motion-provider';
import { getSeasonalTheme, SEASONAL_BOOT_SCRIPT } from '@/lib/seasonal-theme';

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
		description:
			'Read recent messages from any Twitch channel displayed in a more readable format.',
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
		description:
			'Read recent messages from any Twitch channel displayed in a more readable format.',
		images: ['https://emotes.susgee.dev/share_image.png']
	},
	other: {
		'darkreader-lock': ['darkreader-lock'],
		github: 'https://github.com/susgee-dev/susgee-history'
	}
};

const font = Font({
	subsets: ['latin']
});

const dataFont = JetBrains_Mono({
	subsets: ['latin'],
	variable: '--font-jetbrains-mono'
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const seasonalTheme = getSeasonalTheme();

	return (
		<html
			suppressHydrationWarning
			className={`${font.className} ${dataFont.variable} dark scroll-pt-4 scroll-smooth`}
			data-theme={seasonalTheme ?? undefined}
			lang="en"
		>
			<head>
				<link rel="stylesheet" href="https://susgee.dev/susgee-theme.css" />
				<script dangerouslySetInnerHTML={{ __html: SEASONAL_BOOT_SCRIPT }} />
			</head>
			<body className="relative flex min-h-dvh flex-col bg-gradient-bg bg-fixed text-ink">
				<MotionProvider>
					<main className="relative z-10 mx-auto w-full max-w-[45rem] flex-1 p-4">
						{children}
					</main>
					<div className="relative z-10">
						<Footer />
					</div>
				</MotionProvider>
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
