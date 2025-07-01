'use client';

import Badges from '@/components/fragments/badges';
import MessageText from '@/components/fragments/message-text';
import Timestamp from '@/components/fragments/timestamp';
import { cn } from '@/lib/utils';
import { PrivateMessage } from '@/types/message';

type ChatMessageProps = {
	message: PrivateMessage;
};

export default function PrivMessage({ message }: ChatMessageProps) {
	return (
		<div
			className={cn(
				'w-full break-words px-1 text-lg/6',
				message.isFirstMessage ? 'bg-green-500/20' : ''
			)}
		>
			{message.context && (
				<div className="relative top-0.5 text-sm text-muted-foreground">
					{message.context.type === 'system' && message.context.text}
					{message.context.type === 'reply' && (
						<>
							Replying to <span className="font-medium">@{message.context.username}</span>:{' '}
							{message.context.text}
						</>
					)}
				</div>
			)}

			<Timestamp timestamp={message.timestamp} />

			<Badges message={message} />

			<span className="font-semibold" style={{ color: message.color }}>
				{message.bestName}
				{message.addColon && ':'}{' '}
			</span>

			<MessageText isAction={message.isAction} message={message} />
		</div>
	);
}
