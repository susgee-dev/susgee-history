import { IconProps } from '@/types/icons';

export function IconMenu({ size = 24, color = '' }: IconProps) {
	return (
		<svg
			className={color}
			fill="none"
			height={size}
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			viewBox="0 0 24 24"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g stroke="currentColor">
				<line x1="4" x2="20" y1="12" y2="12" />
				<line x1="4" x2="20" y1="6" y2="6" />
				<line x1="4" x2="20" y1="18" y2="18" />
			</g>
		</svg>
	);
}
