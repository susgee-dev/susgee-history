'use client';

import { type MouseEvent, useEffect, useState } from 'react';

import { fetchLogsData } from '@/app/actions';
import MessageList from '@/components/message-list';
import Error from '@/components/ui/error';
import { Heading } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import LoadingSpinner from '@/components/ui/loading-spinner';
import logger from '@/lib/logger';
import { ParsedMessage } from '@/types/message';

type LogsContentProps = {
	channel?: string | null;
	url?: string | null;
	provider?: string | null;
	limit?: number | null;
	reverse?: boolean;
	onBackToSearch: () => void;
};

export default function LogsContent({
	channel,
	url,
	provider,
	limit,
	reverse,
	onBackToSearch
}: LogsContentProps) {
	const [parsed, setParsed] = useState<ParsedMessage[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const handleBackToSearch = (event: MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		onBackToSearch();
	};

	useEffect(() => {
		let cancelled = false;

		async function loadLogsData() {
			setError(null);
			setIsLoading(true);

			try {
				const options = {
					...(channel && { channel }),
					...(url && { url }),
					...(provider && { provider }),
					...(limit && { limit }),
					...(reverse && { reverse })
				};

				const messages = await fetchLogsData(options);

				if (!cancelled) {
					setParsed(messages);
				}
			} catch (err) {
				if (!cancelled) {
					setError('An error occurred while loading logs');
					logger.error(err);
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		loadLogsData();

		return () => {
			cancelled = true;
		};
	}, [channel, url, provider, limit, reverse]);

	if (error) {
		return <Error message={error} title="Error Loading Logs" type="notFound" />;
	}

	const hasCustomSettings = provider || limit || reverse || url;

	return (
		<>
			<Link
				className="touch-manipulation self-start"
				href="/"
				iconBefore={
					<svg
						aria-hidden="true"
						className="size-4"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						<path d="M15 19l-7-7 7-7" />
					</svg>
				}
				onClick={handleBackToSearch}
			>
				back to search
			</Link>

			<div className="flex flex-wrap items-end justify-between">
				<Heading as="h1" className="gradient-text flex w-fit flex-col" variant="compact">
					{channel || 'Logs'}
				</Heading>
				<Heading as="h3" variant="compact">
					recent messages
				</Heading>
			</div>

			{hasCustomSettings && (
				<div className="my-4 rounded-panel border border-line bg-surface-panel p-3">
					<div className="text-sm text-ink-muted">
						<strong className="text-ink-bright">Custom Settings:</strong>
						{url && (
							<div className="mt-1">
								URL: <span className="data text-xs text-ink-bright">{url}</span>
							</div>
						)}
						{provider && (
							<div className="mt-1">
								Provider: <span className="data text-xs text-ink-bright">{provider}</span>
							</div>
						)}
						{limit && (
							<div className="mt-1">
								Limit: <span className="data text-xs text-ink-bright">{limit} messages</span>
							</div>
						)}
						{reverse && (
							<div className="mt-1">
								Reverse Order: <span className="data text-xs text-ink-bright">Yes</span>
							</div>
						)}
					</div>
				</div>
			)}

			{isLoading ? <LoadingSpinner /> : <MessageList messages={parsed} />}
		</>
	);
}
