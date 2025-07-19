'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

const PROVIDER_OPTIONS = [
	{
		label: 'Default (Robotty)',
		value: 'https://recent-messages.robotty.de/api/v2/recent-messages/',
		description: 'recent-messages.robotty.de'
	},
	{
		label: 'Alternative (Zneix)',
		value: 'https://recent-messages.zneix.eu/api/v2/recent-messages/',
		description: 'recent-messages.zneix.eu'
	},
	{
		label: 'Custom URL',
		value: 'custom',
		description: 'Enter your own API endpoint'
	}
];

export default function SearchChannel() {
	const router = useRouter();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [inputValue, setInputValue] = useState('');
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState(
		'https://recent-messages.robotty.de/api/v2/recent-messages/'
	);
	const [customProvider, setCustomProvider] = useState('');
	const [limit, setLimit] = useState('800');
	const [showProviderDropdown, setShowProviderDropdown] = useState(false);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowProviderDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
		setInputValue(event.target.value.trim());
	};

	const handleProviderChange = (value: string) => {
		setSelectedProvider(value);
		setShowProviderDropdown(false);
		if (value !== 'custom') {
			setCustomProvider('');
		}
	};

	const getSelectedProviderLabel = () => {
		const option = PROVIDER_OPTIONS.find((opt) => opt.value === selectedProvider);

		return option ? `${option.label} - ${option.description}` : 'Select provider';
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (inputValue) {
			// Validate custom provider URL if selected
			if (selectedProvider === 'custom' && !customProvider.trim()) {
				alert('Please enter a custom provider URL');

				return;
			}

			const params = new URLSearchParams();

			if (showAdvanced) {
				let finalProvider = '';

				if (selectedProvider === 'custom') {
					finalProvider = customProvider;
				} else {
					finalProvider = selectedProvider;
				}

				if (
					finalProvider &&
					finalProvider !== 'https://recent-messages.robotty.de/api/v2/recent-messages/'
				) {
					// Ensure provider URL ends with a slash
					if (!finalProvider.endsWith('/')) {
						finalProvider = finalProvider + '/';
					}
					params.set('provider', finalProvider);
				}
				if (limit && limit !== '800') {
					params.set('limit', limit);
				}
			}

			const queryString = params.toString();
			const url = queryString ? `/${inputValue}?${queryString}` : `/${inputValue}`;

			router.push(url);
		}
	};

	return (
		<div className="flex w-full flex-col gap-4">
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

			<motion.button
				animate={{ opacity: 1 }}
				className="text-sm text-primary/70 transition-colors duration-200 hover:text-primary"
				initial={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				onClick={() => setShowAdvanced(!showAdvanced)}
			>
				{showAdvanced ? 'Hide' : 'Show'} Advanced Options
			</motion.button>

			{showAdvanced && (
				<motion.div
					animate={{ opacity: 1, height: 'auto' }}
					className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4"
					initial={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-primary/80" htmlFor="provider-dropdown">
							Provider (optional):
						</label>
						<div ref={dropdownRef} className="relative">
							<button
								className="flex w-full items-center justify-between rounded border border-primary/20 bg-transparent px-3 py-2 text-left text-sm text-font transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60"
								id="provider-dropdown"
								type="button"
								onClick={() => setShowProviderDropdown(!showProviderDropdown)}
							>
								<span>{getSelectedProviderLabel()}</span>
								<svg
									className={`h-4 w-4 transition-transform duration-200 ${showProviderDropdown ? 'rotate-180' : ''}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										d="M19 9l-7 7-7-7"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
									/>
								</svg>
							</button>

							{showProviderDropdown && (
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-primary/20 bg-primary-dark shadow-lg"
									initial={{ opacity: 0, y: -10 }}
								>
									{PROVIDER_OPTIONS.map((option) => (
										<button
											key={option.value}
											className={`w-full px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-primary/20 ${
												selectedProvider === option.value
													? 'bg-primary/30 text-primary'
													: 'text-font'
											}`}
											type="button"
											onClick={() => handleProviderChange(option.value)}
										>
											<div className="font-medium">{option.label}</div>
											<div className="text-xs text-primary/60">{option.description}</div>
										</button>
									))}
								</motion.div>
							)}
						</div>
					</div>

					{selectedProvider === 'custom' && (
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-primary/80" htmlFor="custom-provider">
								Custom Provider URL:
							</label>
							<input
								required
								className="w-full rounded border border-primary/20 bg-transparent px-3 py-2 text-sm text-font placeholder-font/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60"
								id="custom-provider"
								placeholder="https://your-api-endpoint.com/api/v2/recent-messages/"
								type="url"
								value={customProvider}
								onChange={(e) => setCustomProvider(e.target.value)}
							/>
							<p className="text-xs text-primary/60">
								Must be a valid recent-messages API endpoint
							</p>
						</div>
					)}

					<div className="flex flex-col gap-2">
						<label className="text-sm font-medium text-primary/80" htmlFor="message-limit">
							Message Limit (optional):
						</label>
						<input
							className="w-full rounded border border-primary/20 bg-transparent px-3 py-2 text-sm text-font placeholder-font/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60"
							id="message-limit"
							max="1000"
							min="1"
							placeholder="800"
							type="number"
							value={limit}
							onChange={(e) => setLimit(e.target.value)}
						/>
						<p className="text-xs text-primary/60">Default: 800, Max: 1,000</p>
					</div>
				</motion.div>
			)}
		</div>
	);
}
