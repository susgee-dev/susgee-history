'use client';

import { useEffect, useState } from 'react';

import { fetchChannelData } from './actions';

import ChatMessage from '@/components/chat-message';
import Error from '@/components/ui/error';
import { Heading } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import { ParsedMessage } from '@/types/message';

export default function ChannelPageClient({ channel }: { channel: string }) {
	const [parsed, setParsed] = useState<ParsedMessage[]>([]);
	const [badges, setBadges] = useState<Record<string, string>>({});
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadChannelData() {
			try {
				const { messages, badges } = await fetchChannelData(channel);

				setParsed(messages);
				setBadges(badges);
			} catch {
				setError('an unknown error occurred');
			} finally {
				setIsLoading(false);
			}
		}

		loadChannelData().then();
	}, [channel]);

	if (error) {
		return <Error message={error} title="Error Loading Channel" type="notFound" />;
	}

	return (
		<>
			<Link href="/">← back to search</Link>

			<div className="mb-4 flex flex-wrap items-end justify-between border-b border-primary/30 pb-4">
				<Heading as="h3" variant="compact">
					recent messages for:
				</Heading>
				<Heading as="h1" className="gradient-text flex w-fit flex-col" variant="compact">
					{channel}
				</Heading>
			</div>

			{isLoading ? (
				<div className="flex items-center justify-center py-16">
					<div className="relative">
						<div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
						<div
							className="absolute inset-0 h-8 w-8 animate-spin rounded-full border-2 border-transparent border-t-primary/60"
							style={{ animationDelay: '-0.5s', animationDuration: '1.5s' }}
						/>
					</div>
					<span className="ml-3 text-sm font-medium text-primary/70">Loading messages...</span>
				</div>
			) : (
				<div className="flex flex-col gap-1">
					{parsed.map((msg) => (
						<ChatMessage key={msg.id} badges={badges} message={msg} />
					))}
				</div>
			)}
		</>
	);
}
