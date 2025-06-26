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
		<div className="container mx-auto px-4 py-8">
			<Link href="/">← back to search</Link>
			<Heading as="h1" className="flex flex-col border-b border-primary/30 pb-6">
				<span>recent messages for:</span>
				<span className="gradient-text w-fit">{channel}</span>
			</Heading>

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className="flex flex-col gap-1">
					{parsed.map((msg) => (
						<ChatMessage key={msg.id} badges={badges} message={msg} />
					))}
				</div>
			)}
		</div>
	);
}
