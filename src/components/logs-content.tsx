'use client';

import { useEffect, useState } from 'react';

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
};

export default function LogsContent({ channel, url, provider, limit, reverse }: LogsContentProps) {
	const [parsed, setParsed] = useState<ParsedMessage[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadLogsData() {
			try {
				const options = {
					...(channel && { channel }),
					...(url && { url }),
					...(provider && { provider }),
					...(limit && { limit }),
					...(reverse && { reverse })
				};

				const messages = await fetchLogsData(options);

				setParsed(messages);
			} catch (err) {
				setError('An error occurred while loading logs');
				logger.error(err);
			} finally {
				setIsLoading(false);
			}
		}

		loadLogsData();
	}, [channel, url, provider, limit, reverse]);

	if (error) {
		return <Error message={error} title="Error Loading Logs" type="notFound" />;
	}

	const hasCustomSettings = provider || limit || reverse || url;

	return (
		<>
			<Link href="/">← back to search</Link>

			<div className="mb-4 flex flex-wrap items-end justify-between">
				<Heading as="h3" variant="compact">
					recent messages for:
				</Heading>
				<Heading as="h1" className="gradient-text flex w-fit flex-col" variant="compact">
					{channel || 'Direct Logs'}
				</Heading>
			</div>

			{hasCustomSettings && (
				<div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
					<div className="text-sm text-primary/80">
						<strong>Custom Settings:</strong>
						{url && (
							<div className="mt-1">
								URL: <span className="font-mono text-xs">{url}</span>
							</div>
						)}
						{provider && (
							<div className="mt-1">
								Provider: <span className="font-mono text-xs">{provider}</span>
							</div>
						)}
						{limit && (
							<div className="mt-1">
								Limit: <span className="font-mono text-xs">{limit} messages</span>
							</div>
						)}
						{reverse && (
							<div className="mt-1">
								Reverse Order: <span className="font-mono text-xs">Yes</span>
							</div>
						)}
					</div>
				</div>
			)}

			{isLoading ? <LoadingSpinner /> : <MessageList messages={parsed} />}
		</>
	);
}
