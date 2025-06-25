'use client';

import { motion } from 'framer-motion';

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
			className="flex w-full items-start gap-2 py-0.5"
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.2 }}
		>
			<div className="flex shrink-0 items-center gap-1">
				{message.badges.map((badge) => {
					const key = `${badge.type}_${badge.version}`;
					const url = badges[key] ?? badges[badge.version ?? ''];
					return url ? (
						<img key={key} src={url} alt={badge.type} className="h-4 w-4" title={badge.type} />
					) : null;
				})}

				<span className="text-lg font-semibold" style={{ color: message.color || '#aaa' }}>
					{message.displayName}:
				</span>
			</div>

			<div className="break-words text-lg">{message.message}</div>
		</motion.div>
	);
}
