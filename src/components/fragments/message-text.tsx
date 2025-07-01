'use client';

import EmoteImage from '@/components/fragments/emote';
import { Link } from '@/components/ui/link';
import { BaseMessage } from '@/types/message';

type MessageTextProps = {
	message: BaseMessage;
	isAction?: boolean;
};

export default function MessageText({ message, isAction = false }: MessageTextProps) {
	return (
		<span
			className="break-word"
			style={{
				color: isAction ? message.color : undefined
			}}
		>
			{message.text.map((word, index) => {
				switch (word.type) {
					case 'emote': {
						return (
							<EmoteImage
								key={index}
								alt={word.content}
								aspectRatio={word.aspectRatio}
								src={word.url}
								title={word.content}
							/>
						);
					}

					case 'link': {
						return (
							<Link key={index} href={word.url} target="_blank" title={word.content}>
								{word.content}
							</Link>
						);
					}

					default: {
						return `${word.content} `;
					}
				}
			})}
		</span>
	);
}
