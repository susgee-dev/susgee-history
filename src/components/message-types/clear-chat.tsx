'use client';

import MessageText from '@/components/fragments/message-text';
import Timestamp from '@/components/fragments/timestamp';
import { ClearChatMessage } from '@/types/message';

type ClearChatProps = {
	message: ClearChatMessage;
};

export default function ClearChat({ message }: ClearChatProps) {
	return (
		<div className={'w-full break-words bg-red-500/20 px-1 py-1 text-lg/6'}>
			<Timestamp timestamp={message.timestamp} />
			<MessageText message={message} />
		</div>
	);
}
