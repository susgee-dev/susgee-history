'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { fadeIn } from '@/lib/motion';

type RecentChannelsProps = {
	channels: string[];
	onOpen: (channel: string) => void;
	onClear: () => void;
};

export default function RecentChannels({ channels, onOpen, onClear }: RecentChannelsProps) {
	return (
		<AnimatePresence>
			{channels.length > 0 && (
				<motion.div
					animate="animate"
					className="flex flex-col gap-2"
					exit="initial"
					initial="initial"
					variants={fadeIn}
				>
					<div className="flex items-center justify-between text-sm text-ink-faint">
						<span>Recently viewed</span>
						<button
							className="touch-manipulation transition-colors hover:text-primary"
							type="button"
							onClick={onClear}
						>
							Clear
						</button>
					</div>
					<div className="flex flex-wrap gap-2">
						{channels.map((channel) => (
							<button
								key={channel}
								className="touch-manipulation rounded-chip border border-line bg-surface-panel px-3 py-1.5 text-sm text-ink transition-colors hover:border-primary-60 hover:text-ink-bright"
								type="button"
								onClick={() => onOpen(channel)}
							>
								{channel}
							</button>
						))}
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
