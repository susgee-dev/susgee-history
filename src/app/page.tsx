import SearchChannel from '@/components/search-channel';
import { Heading } from '@/components/ui/heading';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Twitch history',
	description: "Read through a twitch channel's history"
};

export default function HomePage() {
	return (
		<div className="flex flex-col gap-8 pt-16">
			<Heading variant="compact" as="h1">
				Twitch Channel History
			</Heading>
			<SearchChannel />
		</div>
	);
}
