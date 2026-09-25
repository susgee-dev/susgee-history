import SearchChannel from '@/components/search-channel';
import Error from '@/components/ui/error';

export default function NotFound() {
	return (
		<Error message="This page doesn't exist. Look up a channel instead." type="notFound">
			<SearchChannel />
		</Error>
	);
}
