'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchChannel() {
	const router = useRouter();

	const [inputValue, setInputValue] = useState('');

	const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value.trim());
	};

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (inputValue) {
			router.push(`/${inputValue}`);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
			<motion.div
				className="relative w-full"
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 0.3,
					ease: 'easeInOut'
				}}
			>
				<input
					type="text"
					name="username"
					value={inputValue}
					placeholder="Enter Twitch channel name"
					minLength={1}
					maxLength={25}
					autoComplete="off"
					onChange={handleInput}
					className="w-full rounded-lg border border-primary/30 bg-transparent px-4 py-2 text-font placeholder-font/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60"
				/>
			</motion.div>
			<motion.button
				type="submit"
				disabled={!inputValue}
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{
					duration: 0.3,
					ease: 'easeInOut'
				}}
				className="rounded-lg bg-primary-dark px-4 py-2 text-font transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:pointer-events-none disabled:!opacity-50"
			>
				Go
			</motion.button>
		</form>
	);
}
