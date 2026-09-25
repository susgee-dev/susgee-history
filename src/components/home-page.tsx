'use client';

import { motion } from 'framer-motion';

import SearchChannel from '@/components/search-channel';
import { Heading } from '@/components/ui/heading';
import { fadeUp, stagger } from '@/lib/motion';

export default function HomePage() {
	return (
		<motion.div
			animate="animate"
			className="flex flex-col gap-8 pt-10 sm:pt-20"
			initial="initial"
			variants={stagger}
		>
			<motion.div className="flex flex-col gap-3" variants={fadeUp}>
				<Heading as="h1" variant="compact">
					<span className="gradient-text">Twitch</span> Channel History
				</Heading>
				<p className="text-ink-muted">
					Read the recent chat of any Twitch channel, with emotes and badges. Messages come from
					public recent-messages services, nothing is stored here.
				</p>
			</motion.div>
			<motion.div variants={fadeUp}>
				<SearchChannel />
			</motion.div>
		</motion.div>
	);
}
