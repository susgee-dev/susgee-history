import { ReactNode } from 'react';

type FieldProps = {
	label: string;
	htmlFor: string;
	hint?: string;
	children: ReactNode;
};

export function Field({ label, htmlFor, hint, children }: FieldProps) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-sm font-medium text-ink-muted" htmlFor={htmlFor}>
				{label}
			</label>
			{children}
			{hint && <p className="text-xs text-ink-faint">{hint}</p>}
		</div>
	);
}
