'use client';

import { formatTime } from '@/lib/utils';

type TimestampProps = {
	timestamp: number;
};

export default function Timestamp({ timestamp }: TimestampProps) {
	return <span className="font-mono text-sm text-muted-foreground">{formatTime(timestamp)} </span>;
}
