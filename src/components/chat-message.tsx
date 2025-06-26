'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn, formatTime } from '@/lib/utils';
import { ChatMessageProps, MessageTypes } from '@/types/message';

export default function ChatMessage({ message, badges }: ChatMessageProps) {
	const renderMessageWithLinks = (text: string = '') => {
		if (!text) return '';

		const urlRegex = /(https?:\/\/\S+)/g;
		const parts = text.split(urlRegex);

		return parts.map((part, index) =>
			urlRegex.test(part) ? (
				<Link
					key={index}
					className="text-blue-500 underline hover:text-blue-700"
					href={part}
					rel="noopener noreferrer"
					target="_blank"
				>
					{part}
				</Link>
			) : (
				part
			)
		);
	};

	const processSystemMsg = (msg: string, text: string) => {
		if (text === '') {
			return msg.split(' ').slice(1).join(' ');
		}

		return msg;
	};

	const shouldShowSmallSystemMsg =
		message.type === MessageTypes.USERNOTICE && message.message && message.msgId === 'resub';

	const shouldShowBadges =
		message.type !== MessageTypes.USERNOTICE ||
		(message.type === MessageTypes.USERNOTICE && message.message !== '');

	return (
		<div
			className={cn(
				'w-full break-words px-1 text-lg/6',
				message.isFirstMessage ? 'bg-green-500/20' : '',
				message.type === 'USERNOTICE' ? 'bg-purple-500/20 py-1' : ''
			)}
		>
			{message.type === 'PRIVMSG' && message.reply && (
				<div className="relative top-0.5 text-sm text-muted-foreground">
					Replying to <span className="font-medium">@{message.reply.login}</span>:{' '}
					{message.reply.text}
				</div>
			)}

			{shouldShowSmallSystemMsg && (
				<div className="relative top-0.5 text-sm text-muted-foreground">{message.systemMsg}</div>
			)}

			<span className="mr-2 text-muted-foreground">{formatTime(message.timestamp)}</span>

			{shouldShowBadges &&
				message.badges.map((badge) => {
					const key = `${badge.type}_${badge.version}`;
					const url = badges[key] ?? badges[badge.version ?? ''];

					return url ? (
						<Image
							key={key}
							alt={badge.type}
							className="mr-1 inline-block overflow-hidden align-baseline"
							height={16}
							src={url}
							title={badge.type}
							width={16}
						/>
					) : null;
				})}

			<span className="mr-1 font-semibold" style={{ color: message.color }}>
				{message.bestName}
				{message.type === 'PRIVMSG' && !message.isAction && ':'}
			</span>

			<span
				className="break-all"
				style={{
					color: message.type === 'PRIVMSG' && message.isAction ? message.color : undefined
				}}
			>
				{message.type === 'USERNOTICE' && (!message.message || message.msgId !== 'resub')
					? processSystemMsg(message.systemMsg, message.message)
					: renderMessageWithLinks(message.message)}
			</span>
		</div>
	);
}
