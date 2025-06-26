'use client';

import Image from 'next/image';
import Link from 'next/link';

import { formatTime } from '@/lib/utils';
import { ChatMessageProps } from '@/types/message';

export default function ChatMessage({ message, badges }: ChatMessageProps) {
	const renderMessageWithLinks = () => {
		const urlRegex = /(https?:\/\/\S+)/g;
		const parts = message.message.split(urlRegex);

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

	return (
		<div className="w-full break-words text-lg">
			{message.reply && (
				<div className="relative top-0.5 text-sm text-muted-foreground">
					Replying to <span className="font-medium">@{message.reply.login}</span>:{' '}
					{message.reply.text}
				</div>
			)}
			<span className="mr-2 text-muted-foreground">{formatTime(message.timestamp)}</span>

			{message.badges.map((badge) => {
				const key = `${badge.type}_${badge.version}`;
				const url = badges[key] ?? badges[badge.version ?? ''];

				return url ? (
					<Image
						key={key}
						alt={badge.type}
						className="mr-1 inline-block align-baseline"
						height={16}
						src={url}
						title={badge.type}
						width={16}
					/>
				) : null;
			})}

			<span className="mr-1 font-semibold" style={{ color: message.color }}>
				{message.bestName}
				{!message.isAction && ':'}
			</span>

			<span style={{ color: message.isAction ? message.color : undefined }}>
				{renderMessageWithLinks()}
			</span>
		</div>
	);
}
