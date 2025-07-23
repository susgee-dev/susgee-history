import { redirect } from 'next/navigation';

type PageParams = {
	params: Promise<{ channel: string }>;
	searchParams: Record<string, string | string[]>;
};

export default async function ChannelPage({ params, searchParams }: PageParams) {
	const { channel } = await params;

	const existingParams = new URLSearchParams(
		Object.entries(searchParams).flatMap(([key, value]) =>
			value instanceof Array ? value.map((v) => [key, v]) : [[key, value]]
		)
	);

	existingParams.set('c', channel);

	redirect(`/?${existingParams.toString()}`);
}
