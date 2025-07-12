'use client';

import { Link } from '@/components/ui/link';

export default function Footer() {
	return (
		<footer>
			<p className="text-center">
				Ideas for improvements? Discovered a bug? Feel free to create an{' '}
				<Link href="https://github.com/susgee-dev/susgee-history/issues/new" target="_blank">
					issue on our GitHub
				</Link>
				.
			</p>
			<div className="flex flex-col justify-center gap-1 p-2 text-center text-font-dark md:flex-row md:gap-2">
				<p>
					&copy; {new Date().getFullYear()} <Link href="/">susgee.dev</Link>
				</p>
				<span className="hidden md:flex"> • </span>
				<p>not affiliated with twitch</p>
				<span className="hidden md:flex"> • </span>
				<p>
					Made with 🤍 by
					<Link className="pl-1" href="https://twitch.tv/maersux" rel="noreferrer" target="_blank">
						maersux
					</Link>
				</p>
			</div>
		</footer>
	);
}