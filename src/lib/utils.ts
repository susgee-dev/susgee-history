export function cn(...classes: (string | undefined | null | false)[]): string {
	return classes.filter(Boolean).join(' ');
}

export function getBestName(displayName: string, login: string): string {
	return displayName?.toLowerCase() === login ? displayName : `${displayName} (${login})`;
}

export function formatTime(timestamp: number): string {
	const date = new Date(timestamp);

	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});
}
