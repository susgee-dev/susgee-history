'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

import AdvancedOptions from '@/components/advanced-options';
import RecentChannels from '@/components/recent-channels';
import { Input } from '@/components/ui/input';
import { heightReveal } from '@/lib/motion';
import provider from '@/lib/providers';
import { loadRecentChannels, saveRecentChannel, writeRecentChannels } from '@/lib/recent-channels';
import { cn } from '@/lib/utils';

function toChannelName(input: string) {
	return input
		.trim()
		.toLowerCase()
		.replace(/^@/, '')
		.replace(/^(https?:\/\/)?(www\.|m\.)?twitch\.tv\//, '')
		.split(/[/?#\s]/)[0];
}

export default function SearchChannel() {
	const router = useRouter();
	const channelRef = useRef<HTMLInputElement>(null);

	const [advanced, setAdvanced] = useState(false);
	const [source, setSource] = useState(provider.defaultProvider);
	const [reverse, setReverse] = useState(false);
	const [recentChannels, setRecentChannels] = useState<string[]>([]);

	useEffect(() => {
		setRecentChannels(loadRecentChannels());
	}, []);

	const logsMode = advanced && source === provider.providers.DIRECT_LOGS;

	const openChannel = (channel: string, params = new URLSearchParams()) => {
		params.set('c', channel);
		setRecentChannels(saveRecentChannel(channel));
		router.push(`/?${params}`, { scroll: false });
	};

	const clearRecentChannels = () => {
		writeRecentChannels([]);
		setRecentChannels([]);
	};

	const submit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = new FormData(event.currentTarget);
		const channel = toChannelName(String(form.get('channel') ?? ''));
		const customUrl = String(form.get('customUrl') ?? '').trim();

		if (logsMode && customUrl) {
			router.push(`/?${new URLSearchParams({ url: customUrl })}`, { scroll: false });

			return;
		}

		if (!channel) {
			channelRef.current?.focus();

			return;
		}

		const params = new URLSearchParams();

		if (advanced) {
			const providerUrl = provider.getUrl(source, customUrl);
			const limit = Number(form.get('limit'));

			if (providerUrl) {
				params.set('provider', providerUrl);
			}

			if (limit > 0 && limit !== provider.defaultLimit) {
				params.set('limit', String(limit));
			}

			if (reverse) {
				params.set('reverse', '');
			}
		}

		openChannel(channel, params);
	};

	return (
		<form className="flex w-full flex-col gap-4" onSubmit={submit}>
			<div className="flex w-full gap-2">
				<Input
					ref={channelRef}
					aria-label="Twitch channel"
					autoCapitalize="none"
					autoComplete="off"
					autoCorrect="off"
					enterKeyHint="go"
					name="channel"
					placeholder={
						logsMode ? 'Channel (optional with a logs URL)' : 'Twitch channel, e.g. forsen'
					}
					spellCheck={false}
					type="text"
				/>
				<button
					className={cn(
						'shrink-0 touch-manipulation rounded-control bg-primary-dark px-5 font-medium text-white',
						'transition-colors hover:bg-primary active:bg-primary-60',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas'
					)}
					type="submit"
				>
					Go
				</button>
			</div>

			<RecentChannels
				channels={recentChannels}
				onClear={clearRecentChannels}
				onOpen={(channel) => openChannel(channel)}
			/>

			<button
				aria-expanded={advanced}
				className="flex touch-manipulation items-center gap-1.5 self-start text-sm text-ink-muted transition-colors hover:text-primary"
				type="button"
				onClick={() => setAdvanced(!advanced)}
			>
				Advanced options
				<svg
					aria-hidden="true"
					className={cn('size-4 transition-transform', advanced && 'rotate-180')}
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					viewBox="0 0 24 24"
				>
					<path d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			<AnimatePresence initial={false}>
				{advanced && (
					<motion.div
						animate="animate"
						className="overflow-hidden"
						exit="exit"
						initial="initial"
						variants={heightReveal}
					>
						<AdvancedOptions
							reverse={reverse}
							source={source}
							onReverseChange={setReverse}
							onSourceChange={setSource}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</form>
	);
}
