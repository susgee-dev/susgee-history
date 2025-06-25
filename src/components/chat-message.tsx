'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface TwitchBadge {
	type: string;
	version?: string;
}

interface ParsedMessage {
	id: string;
	timestamp: number;
	displayName: string;
	login: string;
	bestName: string;
	message: string;
	isAction: boolean;
	color?: string;
	badges: TwitchBadge[];
	roles: string[];
	isVip: boolean;
	isMod: boolean;
	isSubscriber: boolean;
	isFirstMessage: boolean;
}

interface ChatMessageProps {
	message: ParsedMessage;
	badges: Record<string, string>;
}

export default function ChatMessage({ message, badges }: ChatMessageProps) {
	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className="flex w-full items-start gap-2 py-0.5"
			initial={{ opacity: 0, y: 4 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex shrink-0 items-center gap-1">
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
				className="break-words text-lg"
				style={{
					color: message.isAction ? message.color : undefined
				}}
			>
				{message.message}
			</div>
		</motion.div>
	);
}
