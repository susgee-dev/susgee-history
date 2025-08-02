'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import Popup from '@/components/ui/popup';
import { RawIRCData } from '@/types/message';

type RawDataProps = {
	data?: RawIRCData[];
};

export default function RawData({ data }: RawDataProps) {
	const [isPopupOpen, setIsPopupOpen] = useState(false);

	const handleClick = () => {
		if (data) {
			setIsPopupOpen(true);
		}
	};

	const handleClosePopup = () => {
		setIsPopupOpen(false);
	};

	if (!data) return null;

	return (
		<>
			<Button
				aria-label="View raw IRC data"
				className="mr-1 size-3 text-sm text-primary"
				size="icon"
				title="View raw IRC data"
				type="button"
				variant="ghost"
				onClick={handleClick}
			>
				?
			</Button>

			{isPopupOpen && (
				<Popup action={handleClosePopup} isOpen={isPopupOpen} title="Raw IRC Data">
					<div className="flex flex-col gap-1">
						{data.map((item, index) => (
							<p key={index}>
								<span className="font-semibold text-muted-foreground">{item.key}: </span>
								<span>{item.value}</span>
							</p>
						))}
					</div>
				</Popup>
			)}
		</>
	);
}
