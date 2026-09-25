'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { controlClasses, Input } from '@/components/ui/input';
import provider from '@/lib/providers';
import { cn } from '@/lib/utils';

type AdvancedOptionsProps = {
	source: string;
	reverse: boolean;
	onSourceChange: (source: string) => void;
	onReverseChange: (reverse: boolean) => void;
};

export default function AdvancedOptions({
	source,
	reverse,
	onSourceChange,
	onReverseChange
}: AdvancedOptionsProps) {
	const selected = provider.options.find((option) => option.value === source);
	const custom = source === provider.providers.CUSTOM;
	const logs = source === provider.providers.DIRECT_LOGS;

	return (
		<div className="flex flex-col gap-4 rounded-panel border border-line bg-surface-panel p-4">
			<Field hint={selected?.description} htmlFor="source" label="Source">
				<div className="relative">
					<select
						className={cn(controlClasses, 'cursor-pointer appearance-none pr-10')}
						id="source"
						value={source}
						onChange={(event) => onSourceChange(event.target.value)}
					>
						{provider.options.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					<svg
						aria-hidden="true"
						className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
						fill="none"
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						viewBox="0 0 24 24"
					>
						<path d="M19 9l-7 7-7-7" />
					</svg>
				</div>
			</Field>

			{(custom || logs) && (
				<Field
					hint={
						custom
							? 'Must be a recent-messages API endpoint.'
							: 'A logs URL for one channel, user and month.'
					}
					htmlFor="custom-url"
					label={custom ? 'Provider URL' : 'Logs URL'}
				>
					<Input
						key={source}
						required
						autoCapitalize="none"
						autoCorrect="off"
						id="custom-url"
						name="customUrl"
						placeholder={
							custom
								? 'https://your-api.example/api/v2/recent-messages/'
								: 'https://logs.susgee.dev/channel/forsen/user/forsen/2025/7'
						}
						spellCheck={false}
						type="url"
					/>
				</Field>
			)}

			<Field htmlFor="limit" label="Message limit">
				<Input
					defaultValue={provider.defaultLimit}
					id="limit"
					inputMode="numeric"
					min={1}
					name="limit"
					type="number"
				/>
			</Field>

			<Checkbox
				checked={reverse}
				id="reverse"
				label="Oldest messages first"
				name="reverse"
				onChange={onReverseChange}
			/>
		</div>
	);
}
