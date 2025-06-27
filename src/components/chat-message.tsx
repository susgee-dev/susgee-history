'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn, formatTime } from '@/lib/utils';
import { ChatMessageProps, MessageTypes, ProcessedWord } from '@/types/message';

function EmoteImage({ src, alt, title }: { src: string; alt: string; title: string }) {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	if (hasError) {
		return (
			<span className="inline-block flex h-7 w-7 items-center justify-center rounded bg-gray-300 text-xs text-gray-600">
				{alt}
			</span>
		);
	}

	return (
		<div className="relative inline-block">
			{isLoading && <div className="h-7 w-7 animate-pulse rounded bg-gray-200" />}
			<Image
				unoptimized
				alt={alt}
				className={cn(
					'mx-0.5 inline-block align-middle transition-opacity duration-200',
					isLoading ? 'opacity-0' : 'opacity-100'
				)}
				height={28}
				loading="lazy"
				src={src}
				title={title}
				width={28}
				onError={() => {
					setIsLoading(false);
					setHasError(true);
				}}
				onLoad={() => setIsLoading(false)}
			/>
		</div>
	);
}

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
				return <EmoteImage key={index} alt={word.alias} src={word.url} title={word.alias} />;
			}

			return <span key={index}>{word.content} </span>;
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
			<span className="mr-1 text-muted-foreground">{formatTime(message.timestamp)} </span>
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
				{message.type === 'PRIVMSG' && !message.isAction && ': '}
			</span>
			<span
				className="break-all"
				style={{
					color: message.type === 'PRIVMSG' && message.isAction ? message.color : undefined
				}}
			>
				{message.type === 'USERNOTICE' && (!message.message || message.msgId !== 'resub')
					? processSystemMsg(message.systemMsg, message.message)
					: message.processedContent
						? renderProcessedContent(message.processedContent)
						: renderMessageWithLinks(message.message)}
			</span>
		</div>
	);
}
