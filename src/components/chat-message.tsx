'use client';

import Image from 'next/image';
import Link from 'next/link';

import EmoteImage from '@/components/fragments/emote';
import { cn, formatTime } from '@/lib/utils';
import { ChatMessageProps, MessageTypes, ProcessedWord } from '@/types/message';

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

	const renderProcessedContent = (content: ProcessedWord[]) => {
		return content.map((word, index) => {
			if (word.type === 'emote') {
				return (
					<EmoteImage
						key={index}
						alt={word.alias}
						aspectRatio={word.aspectRatio}
						src={word.url}
						title={word.alias}
					/>
				);
			}

			return `${word.content} `;
		});
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
				message.type === MessageTypes.USERNOTICE ? 'bg-purple-500/20 py-1' : ''
			)}
		>
			{message.type === MessageTypes.PRIVMSG && message.reply && (
				<div className="relative top-0.5 text-sm text-muted-foreground">
					Replying to <span className="font-medium">@{message.reply.login}</span>:{' '}
					{message.reply.text}
				</div>
			)}
			{shouldShowSmallSystemMsg && (
				<div className="relative top-0.5 text-sm text-muted-foreground">{message.systemMsg}</div>
			)}
			<span className="mr-1 font-mono text-sm text-muted-foreground">
				{formatTime(message.timestamp)}{' '}
			</span>
			{shouldShowBadges &&
				message.badges.map((badge) => {
					const key = `${badge.type}_${badge.version}`;
					const url = badges[key] ?? badges[badge.version ?? ''];

					return url ? (
						<Image
							key={key}
							unoptimized
							alt={badge.type}
							className="mr-1 inline-block select-none overflow-hidden align-baseline"
							height={16}
							loading="lazy"
							src={url}
							title={badge.type}
							width={16}
						/>
					) : null;
				})}
			<span className="font-semibold" style={{ color: message.color }}>
				{message.bestName}
				{message.type === MessageTypes.PRIVMSG && !message.isAction && ':'}{' '}
			</span>
			<span
				className="break-word"
				style={{
					color:
						message.type === MessageTypes.PRIVMSG && message.isAction ? message.color : undefined
				}}
			>
				{message.type === MessageTypes.USERNOTICE && (!message.message || message.msgId !== 'resub')
					? processSystemMsg(message.systemMsg, message.message)
					: message.processedContent
						? renderProcessedContent(message.processedContent)
						: renderMessageWithLinks(message.message)}
			</span>
		</div>
	);
}
