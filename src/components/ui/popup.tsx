'use client';

import { ReactNode, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';

type PopupProps = {
	isOpen: boolean;
	action: () => void;
	title?: string;
	children: ReactNode;
	className?: string;
};

export default function Popup({ isOpen, action, title, children, className = '' }: PopupProps) {
	const popupRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
				action();
			}
		};

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				action();
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
			document.addEventListener('keydown', handleEscapeKey);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEscapeKey);
		};
	}, [isOpen, action]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div
				ref={popupRef}
				className={`max-h-[80vh] w-[90vw] max-w-2xl overflow-auto rounded-lg bg-gradient-bg bg-fixed p-4 shadow-lg ${className}`}
			>
				<div className="mb-4 flex items-center justify-between">
					<Heading variant="compact">{title}</Heading>
					<Button size="icon" variant="ghost" onClick={action}>
						<svg
							fill="none"
							height="24"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							viewBox="0 0 24 24"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<line x1="18" x2="6" y1="6" y2="18" />
							<line x1="6" x2="18" y1="6" y2="18" />
						</svg>
					</Button>
				</div>
				{children}
			</div>
		</div>
	);
}
