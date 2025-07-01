import Image from 'next/image';

import { MessageTypes, ParsedMessage } from '@/types/message';

export default function Badges({ message }: { message: ParsedMessage }) {
	if (message.type === MessageTypes.USERNOTICE) {
		return null;
	}

	return message.badges.map((badge, index) => {
		return (
			<Image
				key={`badge-${index}`}
				unoptimized
				alt={badge.content}
				className="mr-1 inline-block select-none overflow-hidden align-baseline"
				height={16}
				loading="lazy"
				src={badge.url}
				title={badge.content}
				width={16}
			/>
		);
	});
}
