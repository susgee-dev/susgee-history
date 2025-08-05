'use client';

import { Fragment } from 'react';

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
					case 'emote':
						return (
							<Fragment key={`${word.url}-${index}`}>
								<EmoteImage
									alt={word.content}
									aspectRatio={word.aspectRatio}
									id={word.id}
									provider={word.provider}
									src={word.url}
									title={word.content}
								/>{' '}
							</Fragment>
						);

					case 'link':
						return (
							<Fragment key={`${word.url}-${index}`}>
								<Link href={word.url} target="_blank" title={word.content}>
									{word.content}
								</Link>{' '}
							</Fragment>
						);

					default:
						return <Fragment key={`text-${index}`}>{word.content} </Fragment>;
				}
			})}
		</span>
	);
}
