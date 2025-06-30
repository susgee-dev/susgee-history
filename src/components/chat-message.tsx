'use client';

import Image from 'next/image';

import EmoteImage from '@/components/fragments/emote';
import { Link } from '@/components/ui/link';
import { cn, formatTime } from '@/lib/utils';
import { ChatMessageProps, MessageTypes, ParsedPrivMsg, ProcessedWord } from '@/types/message';

export default function ChatMessage({ message }: ChatMessageProps) {
	const renderProcessedContent = (content: ProcessedWord[]) => {
		return content.map((word, index) => {
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
		});
	};

	const processSystemMsg = (msg: string, text: string[]) => {
		if (!text.length) {
			return msg.split(' ').slice(1).join(' ');
		}

		return msg;
	};

	const shouldShowSmallSystemMsg =
		message.type === MessageTypes.USERNOTICE && message.text && message.msgId === 'resub';

	const shouldShowBadges =
		message.type !== MessageTypes.USERNOTICE ||
		(message.type === MessageTypes.USERNOTICE && !message.text.length);

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
				message.badges.map((badge, index) => {
					return (
						<Image
							key={`badge-${index}`}
							unoptimized
							alt={badge.content}
							className="mr-1 inline-block select-none overflow-hidden align-baseline"
							height={16}
							loading="lazy"
							src={badge.url}
							title={badge.content}
							width={16}
						/>
					);
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
				{message.type === MessageTypes.USERNOTICE && (!message.text || message.msgId !== 'resub')
					? processSystemMsg(message.systemMsg, message.text)
					: renderProcessedContent((message as ParsedPrivMsg).text)}
			</span>
		</div>
	);
}
