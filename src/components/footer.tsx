import { Link } from '@/components/ui/link';

function Dot() {
	return <span aria-hidden="true" className="hidden size-1 rounded-full bg-line-strong sm:block" />;
}

export default function Footer() {
	return (
		<footer className="flex flex-col gap-2 px-4 pb-6 pt-10 text-center text-sm">
			<p className="text-ink-muted">
				Ideas or found a bug?{' '}
				<Link href="https://github.com/susgee-dev/susgee-history/issues/new" target="_blank">
					Open an issue on GitHub
				</Link>
			</p>
			<div className="flex flex-col items-center justify-center gap-1 text-ink-faint sm:flex-row sm:gap-3">
				<p>
					&copy; {new Date().getFullYear()} <Link href="https://susgee.dev">susgee.dev</Link>
				</p>
				<Dot />
				<p>not affiliated with Twitch</p>
				<Dot />
				<p>
					made by{' '}
					<Link href="https://twitch.tv/maersux" rel="noreferrer" target="_blank">
						maersux
					</Link>
				</p>
			</div>
		</footer>
	);
}
