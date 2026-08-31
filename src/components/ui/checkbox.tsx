import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

import { popIn } from '@/lib/motion';
import { cn } from '@/lib/utils';

type CheckboxProps = {
	id?: string;
	label?: string;
	className?: string;
	labelClassName?: string;
	checkboxClassName?: string;
	checked?: boolean;
	onChange?: (checked: boolean) => void;
} & Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'>;

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{ id, label, className, labelClassName, checkboxClassName, checked, onChange, ...props },
		ref
	) => {
		const uniqueId = React.useId();
		const checkboxId = id || `checkbox-${uniqueId}`;

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(e.target.checked);
		};

		return (
			<div className={cn('flex items-center gap-3', className)}>
				<div className="relative">
					<input
						ref={ref}
						checked={checked}
						className="peer sr-only"
						id={checkboxId}
						type="checkbox"
						onChange={handleChange}
						{...props}
					/>
					<label aria-label="Checkbox" className="cursor-pointer" htmlFor={checkboxId}>
						<div
							className={cn(
								'relative grid size-6 place-items-center rounded-chip border transition',
								'border-line bg-surface-raised hover:border-line-strong',
								checked ? 'border-primary bg-primary text-white' : 'text-transparent',
								checkboxClassName
							)}
						>
							<AnimatePresence>
								{checked && (
									<motion.svg
										animate="animate"
										className="size-4"
										exit="exit"
										fill="none"
										initial="initial"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="3"
										variants={popIn}
										viewBox="0 0 24 24"
									>
										<path d="M5 12.5l4.5 4.5L19 8" />
									</motion.svg>
								)}
							</AnimatePresence>
						</div>
					</label>
				</div>
				{label && (
					<label
						className={cn(
							'cursor-pointer select-none text-base leading-none text-ink transition-colors',
							'hover:text-ink-bright',
							labelClassName
						)}
						htmlFor={checkboxId}
					>
						{label}
					</label>
				)}
			</div>
		);
	}
);

Checkbox.displayName = 'Checkbox';

export { Checkbox };
