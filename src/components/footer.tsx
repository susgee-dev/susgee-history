'use client';

import { Link } from '@/components/ui/link';

export default function Footer() {
	return (
		<footer className="p-2 flex flex-col justify-center gap-1 md:gap-2 text-center text-font-dark md:flex-row">
			<p>&copy; {new Date().getFullYear()} <Link href="/">susgee.dev</Link></p>
			<span className="hidden md:flex"> • </span>
			<p>not affiliated with twitch</p>
			<span className="hidden md:flex"> • </span>
			<p>
				Made with 🤍 by
				<Link className="pl-1" href="https://twitch.tv/maersux" rel="noreferrer" target="_blank">
					maersux
				</Link>
			</p>
		</footer>
	);
}
