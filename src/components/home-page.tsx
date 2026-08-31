'use client';

import { motion } from 'framer-motion';

import SearchChannel from '@/components/search-channel';
import { Heading } from '@/components/ui/heading';
import { fadeUp, stagger } from '@/lib/motion';

export default function HomePage() {
	return (
		<motion.div
			animate="animate"
			className="flex flex-col gap-8 pt-16"
			initial="initial"
			variants={stagger}
		>
			<motion.div variants={fadeUp}>
				<Heading as="h1" variant="compact">
					Twitch Channel History
				</Heading>
			</motion.div>
			<motion.div variants={fadeUp}>
				<SearchChannel />
			</motion.div>
		</motion.div>
	);
}
