import { Metadata } from 'next';
import { Outfit as Font } from 'next/font/google';
import Script from 'next/script';
import React from 'react';

import Footer from '@/components/footer';

import '@/styles/globals.css';

export const metadata: Metadata = {
	title: {
		default: 'susgee-dev',
		template: '%s | susgee-dev'
	},
	other: {
		'darkreader-lock': ['darkreader-lock']
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
						data-website-id={process.env.TRACKING_ID}
						src="https://umami.susgee.dev/script.js"
						strategy="afterInteractive"
					/>
				)}
			</body>
		</html>
	);
}
