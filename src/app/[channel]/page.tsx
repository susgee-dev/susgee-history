import { redirect } from 'next/navigation';

type PageParams = {
	params: Promise<{ channel: string }>;
	searchParams: Promise<Record<string, string | string[]>>;
};

export default async function ChannelPage({ params, searchParams }: PageParams) {
	const { channel } = await params;
	const resolvedSearchParams = await searchParams;

	const existingParams = new URLSearchParams(
		Object.entries(resolvedSearchParams).flatMap(([key, value]) =>
			value instanceof Array ? value.map((v) => [key, v]) : [[key, value]]
		)
	);

	existingParams.set('c', channel);

	redirect(`/?${existingParams.toString()}`);
}
