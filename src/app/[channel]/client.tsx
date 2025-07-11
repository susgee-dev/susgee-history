'use client';

import { Fragment, useEffect, useState } from 'react';

import { fetchChannelData } from './actions';

import ClearChat from '@/components/clear-chat';
import NewDay from '@/components/fragments/new-day';
import PrivMessage from '@/components/priv-message';
import Error from '@/components/ui/error';
import { Heading } from '@/components/ui/heading';
import { Link } from '@/components/ui/link';
import UserNotice from '@/components/user-notice';
import {
	ClearChatMessage,
	MessageTypes,
	ParsedMessage,
	PrivateMessage,
	UserNoticeMessage
} from '@/types/message';

export default function ChannelPageClient({ channel }: { channel: string }) {
	const [parsed, setParsed] = useState<ParsedMessage[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadChannelData() {
			try {
				const messages = await fetchChannelData(channel);

				setParsed(messages);
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

			<div className="mb-4 flex flex-wrap items-end justify-between">
				<Heading as="h3" variant="compact">
					recent messages for:
				</Heading>
				<Heading as="h1" className="gradient-text flex w-fit flex-col" variant="compact">
					{channel}
				</Heading>
			</div>

			{isLoading ? (
				<div key="loading-state" className="flex items-center justify-center py-16">
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
					{parsed.map((msg, index) => {
						const currentDate = new Date(msg.timestamp).toDateString();
						const prevDate =
							index > 0 ? new Date(parsed[index - 1].timestamp).toDateString() : null;

						const dayChanged = index === 0 || currentDate !== prevDate;

						return (
							<Fragment key={`parent-${msg.id}`}>
								{dayChanged && (
									<NewDay key={`new-day-${msg.timestamp}`} timestamp={msg.timestamp} />
								)}
								{(() => {
									switch (msg.type) {
										case MessageTypes.USERNOTICE:
											return <UserNotice key={msg.id} message={msg as UserNoticeMessage} />;
										case MessageTypes.PRIVMSG:
											return <PrivMessage key={msg.id} message={msg as PrivateMessage} />;
										case MessageTypes.CLEARCHAT:
											return <ClearChat key={msg.id} message={msg as ClearChatMessage} />;
										default:
											return null;
									}
								})()}
							</Fragment>
						);
					})}
				</div>
			)}
		</>
	);
}
