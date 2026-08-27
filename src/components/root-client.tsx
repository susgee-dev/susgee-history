'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import HomePage from '@/components/home-page';
import LogsContent from '@/components/logs-content';

const LOG_SEARCH_PARAMS = ['c', 'url', 'provider', 'limit', 'reverse'] as const;

export default function RootClient() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [showSearch, setShowSearch] = useState(false);

	const channel = searchParams.get('c');
	const url = searchParams.get('url');
	const provider = searchParams.get('provider');
	const limitParam = searchParams.get('limit');
	const limit = limitParam ? parseInt(limitParam, 10) : undefined;
	const reverseParam = searchParams.get('reverse');
	const reverse = reverseParam !== null;

	const hasLogParams = Boolean(channel || url);

	useEffect(() => {
		setShowSearch(false);
	}, [channel, url, provider, limitParam, reverseParam]);

	const handleBackToSearch = useCallback(() => {
		setShowSearch(true);

		const nextParams = new URLSearchParams(searchParams.toString());

		for (const key of LOG_SEARCH_PARAMS) {
			nextParams.delete(key);
		}

		const nextUrl = nextParams.size > 0 ? `${pathname}?${nextParams.toString()}` : pathname;

		window.history.replaceState(window.history.state, '', nextUrl);
	}, [pathname, searchParams]);

	if (!hasLogParams || showSearch) {
		return <HomePage />;
	}

	return (
		<LogsContent
			channel={channel}
			limit={limit}
			provider={provider}
			reverse={reverse}
			url={url}
			onBackToSearch={handleBackToSearch}
		/>
	);
}
