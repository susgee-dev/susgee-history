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
		<form className="flex w-full items-center space-x-2" onSubmit={handleSubmit}>
			<motion.div
				animate={{ opacity: 1, scale: 1 }}
				className="relative w-full"
				initial={{ opacity: 0, scale: 0.95 }}
				transition={{
					duration: 0.3,
					ease: 'easeInOut'
				}}
			>
				<input
					autoComplete="off"
					className="w-full rounded-lg border border-primary/30 bg-transparent px-4 py-2 text-font placeholder-font/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60"
					maxLength={25}
					minLength={1}
					name="username"
					placeholder="Enter Twitch channel name"
					type="text"
					value={inputValue}
					onChange={handleInput}
				/>
			</motion.div>
			<motion.button
				animate={{ opacity: 1, scale: 1 }}
				className="rounded-lg bg-primary-dark px-4 py-2 text-font transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60 disabled:pointer-events-none disabled:!opacity-50"
				disabled={!inputValue}
				initial={{ opacity: 0, scale: 0.95 }}
				transition={{
					duration: 0.3,
					ease: 'easeInOut'
				}}
				type="submit"
			>
				Go
			</motion.button>
		</form>
	);
}
