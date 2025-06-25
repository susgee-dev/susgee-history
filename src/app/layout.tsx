import '@/styles/globals.css';
import { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import React from 'react';
import Footer from '@/components/footer';

export const metadata: Metadata = {
	title: {
		default: 'susgee-dev',
		template: '%s | susgee-dev'
	},
	other: {
		'darkreader-lock': ['darkreader-lock']
	}
};

const outfit = Outfit({
	subsets: ['latin']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html suppressHydrationWarning className={`${outfit.className} dark`} lang="en">
			<body className="flex min-h-screen flex-col bg-gradient-bg bg-fixed text-font">
				<main className="mx-auto w-full max-w-[35rem] flex-1 p-4">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
