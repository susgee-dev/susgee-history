'use client';

import Popup from '@/components/ui/popup';

type RawDataPopupProps = {
	isOpen: boolean;
	action: () => void;
	data: { key: string; value: string }[];
};

export default function RawDataPopup({ isOpen, action, data }: RawDataPopupProps) {
	if (!isOpen) return null;

	return (
		<Popup action={action} isOpen={isOpen} title="Raw IRC Data">
			<div className="flex flex-col gap-1 font-mono text-sm">
				{data.map((item, index) => (
					<p key={index}>
						<span className="font-semibold text-muted-foreground">{item.key}: </span>
						<span>{item.value}</span>
					</p>
				))}
			</div>
		</Popup>
	);
}
