'use client';

import { Fragment } from 'react';

import NewDay from '@/components/fragments/new-day';
import ClearChat from '@/components/message-types/clear-chat';
import PrivMessage from '@/components/message-types/priv-message';
import UserNotice from '@/components/message-types/user-notice';
import {
	ClearChatMessage,
	MessageTypes,
	ParsedMessage,
	PrivateMessage,
	UserNoticeMessage
} from '@/types/message';

type MessageListProps = {
	messages: ParsedMessage[];
};

export default function MessageList({ messages }: MessageListProps) {
	if (!messages.length) {
		return <div className="py-4 text-center">No messages to display</div>;
	}

	return (
		<div className="flex flex-col gap-1">
			{messages.map((msg, index) => {
				const currentDate = new Date(msg.timestamp).toDateString();
				const prevDate = index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;

				const dayChanged = index === 0 || currentDate !== prevDate;

				return (
					<Fragment key={`parent-${msg.id}`}>
						{dayChanged && <NewDay key={`new-day-${msg.timestamp}`} timestamp={msg.timestamp} />}
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
	);
}
