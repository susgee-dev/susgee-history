'use client';

import { motion } from 'framer-motion';
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
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="flex w-full items-start gap-2 py-0.5"
			initial={{ opacity: 0, y: 4 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex shrink-0 items-center gap-1">
				<span className="mr-1 text-lg text-muted-foreground">{formatTime(message.timestamp)}</span>
				{message.badges.map((badge) => {
					const key = `${badge.type}_${badge.version}`;
					const url = badges[key] ?? badges[badge.version ?? ''];

					return url ? (
						<Image key={key} alt={badge.type} height={16} src={url} title={badge.type} width={16} />
					) : null;
				})}

				<span className="text-lg font-semibold" style={{ color: message.color }}>
					{message.bestName}
					{!message.isAction && ':'}
				</span>
			</div>

			<div
				className="break-word text-lg"
				style={{
					color: message.isAction ? message.color : undefined
				}}
			>
				{renderMessageWithLinks()}
			</div>
		</motion.div>
	);
}
