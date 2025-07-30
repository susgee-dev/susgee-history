'use client';

import { useState } from 'react';

import RawDataPopup from '@/components/fragments/raw-data-popup';
import { formatTime } from '@/lib/utils';

type TimestampProps = {
	timestamp: number;
	rawIRC?: { key: string; value: string }[];
};

export default function Timestamp({ timestamp, rawIRC }: TimestampProps) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const handleClick = () => {
		if (rawIRC) {
			setIsPopupOpen(true);
		}
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
	};

	return (
		<>
			{rawIRC ? (
				<button
					aria-label="View raw IRC data"
					className="font-mono text-sm text-muted-foreground"
					title="Click to view raw IRC data"
					type="button"
					onClick={handleClick}
				>
					{formatTime(timestamp)}&nbsp;
				</button>
			) : (
				<span className="font-mono text-sm text-muted-foreground">{formatTime(timestamp)} </span>
			)}

			{rawIRC && isPopupOpen && (
				<RawDataPopup action={handleClosePopup} data={rawIRC} isOpen={isPopupOpen} />
			)}
		</>
	);
}
