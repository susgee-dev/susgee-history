'use client';

type NewDayProps = {
	timestamp: number;
};

export default function NewDay({ timestamp }: NewDayProps) {
	const date = new Date(timestamp);
	const formattedDate = date.toLocaleDateString(undefined, {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return (
		<div className="my-4 flex items-center">
			<div className="flex-grow border-t border-primary/30" />
			<span className="mx-4 text-sm text-muted-foreground">{formattedDate}</span>
			<div className="flex-grow border-t border-primary/30" />
		</div>
	);
}
