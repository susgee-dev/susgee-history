'use client';

type NewDayProps = {
	timestamp: number;
};

export default function NewDay({ timestamp }: NewDayProps) {
	const date = new Date(timestamp);
	const formattedDate = date.toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return (
		<div className="my-5 flex items-center gap-3">
			<div className="h-px flex-1 bg-line-soft" />
			<span className="data whitespace-nowrap text-xs text-ink-faint">{formattedDate}</span>
			<div className="h-px flex-1 bg-line-soft" />
		</div>
	);
}
