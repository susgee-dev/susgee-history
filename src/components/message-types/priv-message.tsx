'use client';

import { MouseEvent, useEffect, useState } from 'react';

import Badges from '@/components/fragments/badges';
import MessageText from '@/components/fragments/message-text';
import RawData from '@/components/fragments/raw-data';
import Timestamp from '@/components/fragments/timestamp';
import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';
import { PrivateMessage } from '@/types/message';

type ChatMessageProps = {
	message: PrivateMessage;
};

export default function PrivMessage({ message }: ChatMessageProps) {
	const [isHighlighted, setIsHighlighted] = useState(false);

	useEffect(() => {
		const checkHash = () => {
			if (window.location.hash === `#${message.id}`) {
				setIsHighlighted(true);

				const messageElement = document.getElementById(message.id);

				if (messageElement) {
					messageElement.scrollIntoView({ behavior: 'smooth' });
				}

				const timer = setTimeout(() => {
					setIsHighlighted(false);
				}, 2000);

				return () => clearTimeout(timer);
			}
		};

		checkHash();
		window.addEventListener('hashchange', checkHash);

		return () => {
			window.removeEventListener('hashchange', checkHash);
		};
	}, [message.id]);

	const handleReplyClick = (e: MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();

		const targetId = message.context?.id;

		if (!targetId) return;

		const targetElement = document.getElementById(targetId);

		if (targetElement) {
			window.location.hash = '';

			setTimeout(() => {
				window.location.hash = targetId;
				targetElement.scrollIntoView({ behavior: 'smooth' });
			}, 5);
		}
	};

	return (
		<div
			className={cn(
				'w-full break-words px-1 text-lg/6',
				message.isFirstMessage ? 'bg-green-500/20' : '',
				isHighlighted ? 'animate-highlight' : ''
			)}
			id={message.id}
		>
			{message.context && (
				<div className="relative top-0.5 text-sm text-muted-foreground">
					{message.context.type === 'system' && message.context.text}
					{message.context.type === 'reply' && (
						<Link href={`#${message.context.id}`} unstyled={true} onClick={handleReplyClick}>
							<span>
								Replying to <span className="font-medium">@{message.context.username}</span>:{' '}
								{message.context.text}
							</span>
						</Link>
					)}
				</div>
			)}

			<RawData data={message.rawIRC} />
			<Timestamp timestamp={message.timestamp} />

			<Badges message={message} />

			<span className="font-semibold" style={{ color: `hsl(from ${message.color} h s 60%)` }}>
				{message.bestName}
				{message.addColon && ':'}{' '}
			</span>

			<MessageText isAction={message.isAction} message={message} />
		</div>
	);
}
