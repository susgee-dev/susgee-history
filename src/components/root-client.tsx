'use client';

import { useSearchParams } from 'next/navigation';

import HomePage from '@/components/home-page';
import LogsContent from '@/components/logs-content';

export default function RootClient() {
	const searchParams = useSearchParams();

	const channel = searchParams.get('c');
	const url = searchParams.get('url');
	const provider = searchParams.get('provider');
	const limitParam = searchParams.get('limit');
	const limit = limitParam ? parseInt(limitParam, 10) : undefined;
	const reverseParam = searchParams.get('reverse');
	const reverse = reverseParam !== null;

	const loadLogs = channel || url;

	if (!loadLogs) {
		return <HomePage />;
	}

	return (
		<LogsContent channel={channel} limit={limit} provider={provider} reverse={reverse} url={url} />
	);
}
