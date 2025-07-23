'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

const DEFAULT_PROVIDER = 'https://recent-messages.robotty.de/api/v2/recent-messages/';
const DEFAULT_LIMIT = '800';

const PROVIDER_OPTIONS = [
	{
		label: 'Robotty (Default)',
		value: DEFAULT_PROVIDER,
		description: 'recent-messages.robotty.de'
	},
	{
		label: 'Zneix',
		value: 'https://recent-messages.zneix.eu/api/v2/recent-messages/',
		description: 'recent-messages.zneix.eu'
	},
	{
		label: 'Zonian',
		value: 'https://logs.zonian.dev/rm/',
		description: 'logs.zonian.dev'
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
	const [selectedProvider, setSelectedProvider] = useState(DEFAULT_PROVIDER);
	const [customProvider, setCustomProvider] = useState('');
	const [limit, setLimit] = useState(DEFAULT_LIMIT);
	const [showProviderDropdown, setShowProviderDropdown] = useState(false);

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

	const getProviderUrl = (): string | null => {
		if (!showAdvanced) return null;

		if (selectedProvider === DEFAULT_PROVIDER) return null;

		if (selectedProvider === 'custom') {
			if (!customProvider.trim()) {
				return DEFAULT_PROVIDER;
			}

			return customProvider;
		}

		return selectedProvider;
	};

	const createCustomUrl = (
		inputValue: string,
		providerUrl: null | string,
		limit: null | string
	) => {
		const baseUrl = `/${inputValue}`;

		if (!providerUrl && !limit) return baseUrl;

		const params: string[] = [];

		if (providerUrl) params.push(`provider=${providerUrl}`);
		if (limit && limit !== DEFAULT_LIMIT) params.push(`limit=${limit}`);

		return `${baseUrl}?${params.join('&')}`;
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!inputValue) return;

		const providerUrl = getProviderUrl();

		const url = createCustomUrl(
			inputValue,
			providerUrl || null,
			showAdvanced && limit !== DEFAULT_LIMIT ? limit : null
		);

		router.push(url, { scroll: false });
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
						className={cn(
							'w-full rounded-lg border border-primary/30 bg-transparent px-4 py-2',
							'text-font placeholder-font/50 transition-all duration-300',
							'focus:outline-none focus:ring-2 focus:ring-primary/60'
						)}
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
					className={cn(
						'rounded-lg bg-primary-dark px-4 py-2 text-font',
						'transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/60',
						'disabled:pointer-events-none disabled:!opacity-50'
					)}
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
				className={cn('text-sm text-primary/70 transition-colors duration-200 hover:text-primary')}
				initial={{ opacity: 0 }}
				transition={{ duration: 0.2 }}
				onClick={() => setShowAdvanced(!showAdvanced)}
			>
				{showAdvanced ? 'Hide' : 'Show'} Advanced Options
			</motion.button>

			<AnimatePresence>
				{showAdvanced && (
					<motion.div
						animate={{ opacity: 1, scale: 1 }}
						className="flex origin-top flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4"
						exit={{ opacity: 0, scale: 0.97 }}
						initial={{ opacity: 0, scale: 0.97 }}
						transition={{
							duration: 0.2,
							ease: 'easeInOut'
						}}
					>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-primary/80" htmlFor="provider-dropdown">
								Provider (optional):
							</label>
							<div ref={dropdownRef} className="relative">
								<button
									className={cn(
										'flex w-full items-center justify-between rounded border border-primary/20',
										'bg-transparent px-3 py-2 text-left text-sm text-font transition-all duration-300',
										'focus:outline-none focus:ring-2 focus:ring-primary/60'
									)}
									id="provider-dropdown"
									type="button"
									onClick={() => setShowProviderDropdown(!showProviderDropdown)}
								>
									<span>{getSelectedProviderLabel()}</span>
									<svg
										className={cn(
											'h-4 w-4 transition-transform duration-200',
											showProviderDropdown ? 'rotate-180' : ''
										)}
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

								<AnimatePresence>
									{showProviderDropdown && (
										<motion.div
											animate={{ opacity: 1, scale: 1 }}
											className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 origin-top overflow-y-auto rounded-lg border border-primary/20 bg-primary-dark shadow-lg"
											exit={{ opacity: 0, scale: 0.97 }}
											initial={{ opacity: 0, scale: 0.97 }}
											transition={{ duration: 0.2, ease: 'easeInOut' }}
										>
											{PROVIDER_OPTIONS.map((option) => (
												<button
													key={option.value}
													className={cn(
														'w-full px-3 py-2 text-left text-sm transition-colors duration-150 hover:bg-primary/20',
														selectedProvider === option.value && 'bg-primary/30'
													)}
													type="button"
													onClick={() => handleProviderChange(option.value)}
												>
													<div className="font-medium">{option.label}</div>
													<div className="text-xs text-primary/60">{option.description}</div>
												</button>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>

						{selectedProvider === 'custom' && (
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-primary/80" htmlFor="custom-provider">
									Custom Provider URL:
								</label>
								<input
									required
									className={cn(
										'w-full rounded border border-primary/20 bg-transparent px-3 py-2 text-sm',
										'text-font placeholder-font/50 transition-all duration-300',
										'focus:outline-none focus:ring-2 focus:ring-primary/60'
									)}
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
								className={cn(
									'w-full rounded border border-primary/20 bg-transparent px-3 py-2 text-sm',
									'text-font placeholder-font/50 transition-all duration-300',
									'focus:outline-none focus:ring-2 focus:ring-primary/60'
								)}
								id="message-limit"
								min="1"
								placeholder={DEFAULT_LIMIT}
								type="number"
								value={limit}
								onChange={(e) => setLimit(e.target.value)}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
