'use client';

import MessageText from '@/components/fragments/message-text';
import RawData from '@/components/fragments/raw-data';
import Timestamp from '@/components/fragments/timestamp';
import { UserNoticeMessage } from '@/types/message';

type UserNoticeProps = {
	message: UserNoticeMessage;
};

export default function UserNotice({ message }: UserNoticeProps) {
	return (
		<div className={'w-full break-words bg-purple-500/20 px-1 py-1 text-lg/6'}>
			{message.context && (
				<div className="relative top-0.5 text-sm text-muted-foreground">{message.context.text}</div>
			)}

			<RawData data={message.rawIRC} />
			<Timestamp timestamp={message.timestamp} />

			<span className="font-semibold" style={{ color: message.color }}>
				{message.bestName}{' '}
			</span>

			<MessageText message={message} />
		</div>
	);
}
