import Image from 'next/image';
import { useState } from 'react';

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
		<Link href={`https://chatvau.lt/emote/${provider}/${id}`} target="_blank">
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
		</Link>
	);
}
