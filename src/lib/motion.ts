import type { Variants } from 'framer-motion';

const easeOut = 'easeOut' as const;

export const motionDuration = 0.4;
export const motionDurationOut = 0.2;
export const motionStagger = 0.1;

export const fadeUp: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: motionDuration, ease: easeOut }
	}
};

export const fadeDown: Variants = {
	initial: { opacity: 0, y: -10 },
	animate: {
		opacity: 1,
		y: 0,
		transition: { duration: motionDuration, ease: easeOut }
	}
};

export const fadeIn: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1, transition: { duration: motionDuration } }
};

export const stagger: Variants = {
	animate: {
		transition: {
			staggerChildren: motionStagger,
			delayChildren: motionStagger
		}
	}
};

export const popIn: Variants = {
	initial: { opacity: 0, scale: 0.95 },
	animate: {
		opacity: 1,
		scale: 1,
		transition: { duration: motionDuration }
	},
	exit: {
		opacity: 0,
		scale: 0.95,
		transition: { duration: motionDurationOut }
	}
};

export const heightReveal: Variants = {
	initial: { height: 0, opacity: 0 },
	animate: {
		height: 'auto',
		opacity: 1,
		transition: { duration: motionDuration }
	},
	exit: {
		height: 0,
		opacity: 0,
		transition: { duration: motionDurationOut }
	}
};

export const delay = (index: number) => ({ delay: index * motionStagger });
