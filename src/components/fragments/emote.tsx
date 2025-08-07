import Image from 'next/image';
import { KeyboardEvent, useRef, useState } from 'react';

import { Link } from '@/components/ui/link';
import { cn } from '@/lib/utils';

type Emote = {
	id: string;
	provider: string;
	src: string;
	alt: string;
	title: string;
	aspectRatio: number;
};

export default function EmoteImage({ id, provider, src, alt, title, aspectRatio }: Emote) {
	const [hasError, setHasError] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const tooltipRef = useRef<HTMLDivElement>(null);

	const height = 24;
	const width = Math.floor(height * aspectRatio);

	const tooltipHeight = height * 2;
	const tooltipWidth = Math.floor(tooltipHeight * aspectRatio);

	const handleClickOutside = (e: MouseEvent) => {
		if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
			setShowTooltip(false);
		}
	};

	const toggleTooltip = () => {
		const newState = !showTooltip;

		setShowTooltip(newState);

		if (newState) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			toggleTooltip();
		}
	};

	if (hasError) {
		return (
			<span
				className={cn(
					'inline-block items-center justify-center rounded bg-gray-300 text-xs text-gray-600',
					`w-[${width}px] h-[${height}px]`
				)}
			>
				{alt}
			</span>
		);
	}

	return (
		<div className="relative inline-block">
			<button
				aria-expanded={showTooltip}
				aria-haspopup="true"
				aria-label={`Emote: ${title}`}
				className="inline-block appearance-none border-0 bg-transparent p-0"
				type="button"
				onClick={toggleTooltip}
				onKeyDown={handleKeyDown}
			>
				<Image
					unoptimized
					alt={alt}
					className="mx-0.5 inline-block align-sub"
					height={height}
					loading="lazy"
					src={src}
					title={title}
					width={width}
					onError={() => {
						setHasError(true);
					}}
				/>
			</button>

			{showTooltip && (
				<div
					ref={tooltipRef}
					className="absolute z-50 mt-1 rounded-md border border-primary-dark bg-gradient-bg p-3 shadow-lg"
					style={{
						top: '100%',
						left: '50%',
						transform: 'translateX(-50%)',
						minWidth: '180px',
						maxWidth: '100%'
					}}
				>
					<div className="flex flex-col items-center gap-2">
						<Image
							unoptimized
							alt={alt}
							height={tooltipHeight}
							loading="lazy"
							src={src}
							width={tooltipWidth}
						/>
						<span className="text-center font-medium text-font">{title}</span>
						<Link
							className="text-sm"
							href={`https://chatvau.lt/emote/${provider}/${id}`}
							iconAfter={
								<svg
									height={12}
									shapeRendering="geometricPrecision"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
									viewBox="0 0 24 24"
									width={12}
									xmlns="http://www.w3.org/2000/svg"
								>
									<g>
										<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
										<path d="M15 3h6v6" />
										<path d="M10 14L21 3" />
									</g>
								</svg>
							}
							target="_blank"
						>
							View Details
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
