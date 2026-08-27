'use client';

import { formatTime } from '@/lib/utils';

type TimestampProps = {
	timestamp: number;
};

export default function Timestamp({ timestamp }: TimestampProps) {
	return <span className="data text-sm text-ink-muted">{formatTime(timestamp)} </span>;
}
