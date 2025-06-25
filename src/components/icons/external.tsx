import { IconProps } from '@/types/icons';

export function IconExternal({ size = 24, color = '' }: IconProps) {
	return (
		<svg
			className={color}
			fill="none"
			height={size}
			shapeRendering="geometricPrecision"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.5"
			viewBox="0 0 24 24"
			width={size}
			xmlns="http://www.w3.org/2000/svg"
		>
			<g stroke="currentColor">
				<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
				<path d="M15 3h6v6" />
				<path d="M10 14L21 3" />
			</g>
		</svg>
	);
}
