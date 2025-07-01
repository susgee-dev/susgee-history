'use client';

import Badges from '@/components/fragments/badges';
import EmoteImage from '@/components/fragments/emote';
import { Link } from '@/components/ui/link';
import { cn, formatTime } from '@/lib/utils';
import { ChatMessageProps, MessageTypes } from '@/types/message';

export default function ChatMessage({ message }: ChatMessageProps) {
	return (
		<div
			className={cn(
				'w-full break-words px-1 text-lg/6',
				message.isFirstMessage ? 'bg-green-500/20' : '',
				message.type === MessageTypes.USERNOTICE ? 'bg-purple-500/20 py-1' : ''
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

			<span className="font-mono text-sm text-muted-foreground">
				{formatTime(message.timestamp)}{' '}
			</span>

			<Badges message={message} />

			<span className="font-semibold" style={{ color: message.color }}>
				{message.bestName}
				{message.addColon && ':'}{' '}
			</span>
			<span
				className="break-word"
				style={{
					color: message.isAction ? message.color : undefined
				}}
			>
				{message.text.map((word, index) => {
					switch (word.type) {
						case 'emote': {
							return (
								<EmoteImage
									key={index}
									alt={word.content}
									aspectRatio={word.aspectRatio}
									src={word.url}
									title={word.content}
								/>
							);
						}

						case 'link': {
							return (
								<Link
									key={index}
									className="text-primary"
									href={word.url}
									target="_blank"
									title={word.content}
								>
									{word.content}
								</Link>
							);
						}

						default: {
							return `${word.content} `;
						}
					}
				})}
			</span>
		</div>
	);
}
