import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/lib/utils';

type Emote = {
	src: string;
	alt: string;
	title: string;
	aspectRatio: number;
};

export default function EmoteImage({ src, alt, title, aspectRatio }: Emote) {
	const [hasError, setHasError] = useState(false);

	const height = 24;
	const width = Math.floor(height * aspectRatio);

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
	);
}
