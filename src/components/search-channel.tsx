'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { fadeIn, popIn } from '@/lib/motion';
import provider from '@/lib/providers';
import { cn } from '@/lib/utils';

export default function SearchChannel() {
	const router = useRouter();
	const dropdownRef = useRef<HTMLDivElement>(null);

	const [inputValue, setInputValue] = useState('');
	const [showAdvanced, setShowAdvanced] = useState(false);
	const [selectedProvider, setSelectedProvider] = useState(provider.defaultProvider as string);
	const [customProvider, setCustomProvider] = useState('');
	const [limit, setLimit] = useState(provider.defaultLimit);
	const [reverseOrder, setReverseOrder] = useState(false);
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
		if (value !== provider.providers.CUSTOM) {
			setCustomProvider('');
		}
	};

	const getSelectedProviderLabel = () => {
		const option = provider.options.find((opt) => opt.value === selectedProvider);

		return option ? `${option.label} - ${option.description}` : 'Select provider';
	};

	const getProviderUrl = (): string | null => {
		if (!showAdvanced) return null;

		return provider.getUrl(selectedProvider, customProvider);
	};

	const createCustomUrl = (
		inputValue: string,
		providerUrl: null | string,
		limit: null | number,
		reverse: boolean | null
	) => {
		const params: string[] = [];

		const isDirectLogsUrl =
			selectedProvider === provider.providers.DIRECT_LOGS && customProvider.trim();

		if (isDirectLogsUrl) {
			params.push(`url=${encodeURIComponent(customProvider.trim())}`);
		} else if (inputValue) {
			params.push(`c=${inputValue}`);
		}

		if (providerUrl && !isDirectLogsUrl) params.push(`provider=${encodeURIComponent(providerUrl)}`);
		if (limit && limit !== provider.defaultLimit) params.push(`limit=${limit}`);
		if (reverse === true) params.push(`reverse`);

		return `/?${params.join('&')}`;
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const isDirectLogsUrl =
			selectedProvider === provider.providers.DIRECT_LOGS && customProvider.trim();

		if (!isDirectLogsUrl && !inputValue) return;

		const providerUrl = getProviderUrl();

		const url = createCustomUrl(
			inputValue,
			providerUrl || null,
			showAdvanced && limit !== provider.defaultLimit ? limit : null,
			showAdvanced ? reverseOrder : null
		);

		router.push(url, { scroll: false });
	};

	return (
		<div className="flex w-full flex-col gap-4">
			<form className="flex w-full items-center space-x-2" onSubmit={handleSubmit}>
				<motion.div
					animate="animate"
					className="relative w-full"
					initial="initial"
					variants={popIn}
				>
					<input
						autoComplete="off"
						className={cn(
							'w-full rounded-control border border-line bg-surface-raised px-4 py-2',
							'text-ink transition-all placeholder:text-ink-muted',
							'focus:border-primary-60 focus:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas',
							showAdvanced &&
								selectedProvider === provider.providers.DIRECT_LOGS &&
								customProvider.trim()
								? 'border-line-soft'
								: ''
						)}
						maxLength={25}
						minLength={1}
						name="username"
						placeholder={
							showAdvanced &&
							selectedProvider === provider.providers.DIRECT_LOGS &&
							customProvider.trim()
								? 'Channel name (optional for direct logs)'
								: 'Enter Twitch channel name'
						}
						type="text"
						value={inputValue}
						onChange={handleInput}
					/>
				</motion.div>
				<motion.button
					animate="animate"
					className={cn(
						'rounded-control bg-primary-dark px-4 py-2 text-white hover:bg-primary',
						'transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas',
						'disabled:pointer-events-none disabled:!opacity-50'
					)}
					disabled={
						!(
							inputValue ||
							(showAdvanced &&
								selectedProvider === provider.providers.DIRECT_LOGS &&
								customProvider.trim())
						)
					}
					initial="initial"
					type="submit"
					variants={popIn}
				>
					Go
				</motion.button>
			</form>

			<motion.button
				animate="animate"
				className={cn('text-sm text-ink-muted transition-colors hover:text-primary')}
				initial="initial"
				type="button"
				variants={fadeIn}
				onClick={() => setShowAdvanced(!showAdvanced)}
			>
				{showAdvanced ? 'Hide' : 'Show'} Advanced Options
			</motion.button>

			<AnimatePresence>
				{showAdvanced && (
					<motion.div
						animate="animate"
						className="flex origin-top flex-col gap-3 rounded-panel border border-line bg-surface-panel p-4"
						exit="exit"
						initial="initial"
						variants={popIn}
					>
						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-ink-muted" htmlFor="provider-dropdown">
								Provider (optional):
							</label>
							<div ref={dropdownRef} className="relative">
								<button
									className={cn(
										'flex w-full items-center justify-between rounded-control border border-line bg-surface-raised',
										'px-3 py-2 text-left text-sm text-ink transition-all hover:bg-accent',
										'focus:border-primary-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas'
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
											animate="animate"
											className="absolute left-0 right-0 top-full z-10 mt-1 origin-top overflow-y-auto rounded-control border border-line bg-surface-raised shadow-lg"
											exit="exit"
											initial="initial"
											variants={popIn}
										>
											{provider.options.map((option) => (
												<button
													key={option.value}
													className={cn(
														'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
														selectedProvider === option.value && 'bg-accent text-ink-bright'
													)}
													type="button"
													onClick={() => handleProviderChange(option.value)}
												>
													<div className="font-medium">{option.label}</div>
													<div className="text-xs text-ink-faint">{option.description}</div>
												</button>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						</div>

						{(selectedProvider === provider.providers.CUSTOM ||
							selectedProvider === provider.providers.DIRECT_LOGS) && (
							<div className="flex flex-col gap-2">
								<label className="text-sm font-medium text-ink-muted" htmlFor="custom-provider">
									{selectedProvider === provider.providers.CUSTOM
										? 'Custom Provider URL:'
										: 'Direct Logs URL:'}
								</label>
								<input
									required
									className={cn(
										'w-full rounded-control border border-line bg-surface-raised px-3 py-2 text-sm',
										'text-ink transition-all placeholder:text-ink-muted',
										'focus:border-primary-60 focus:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas'
									)}
									id="custom-provider"
									placeholder={
										selectedProvider === provider.providers.CUSTOM
											? 'https://your-api-endpoint.com/api/v2/recent-messages/'
											: 'https://logs.susgee.dev/channel/channelname/user/username/2025/7'
									}
									type="url"
									value={customProvider}
									onChange={(e) => setCustomProvider(e.target.value)}
								/>
								<p className="text-xs text-ink-faint">
									{selectedProvider === provider.providers.CUSTOM
										? 'Must be a valid recent-messages API endpoint'
										: 'Enter a direct logs URL (will add ?raw if needed)'}
								</p>
							</div>
						)}

						<div className="flex flex-col gap-2">
							<label className="text-sm font-medium text-ink-muted" htmlFor="message-limit">
								Message Limit (optional):
							</label>
							<input
								className={cn(
									'w-full rounded-control border border-line bg-surface-raised px-3 py-2 text-sm',
									'text-ink transition-all placeholder:text-ink-muted',
									'focus:border-primary-60 focus:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas'
								)}
								id="message-limit"
								min="1"
								placeholder={provider.defaultLimit?.toString()}
								type="number"
								value={limit}
								onChange={(e) => setLimit(Number(e.target.value))}
							/>
						</div>

						<div className="flex items-center">
							<Checkbox
								checked={reverseOrder}
								id="reverse-order"
								label="Reverse Message Order (oldest first)"
								onChange={(checked) => setReverseOrder(checked)}
							/>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
