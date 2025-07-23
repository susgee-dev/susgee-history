import { AnimatePresence, motion } from 'framer-motion';
import * as React from 'react';

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
						className="hidden"
						id={checkboxId}
						type="checkbox"
						onChange={handleChange}
						{...props}
					/>
					<label aria-label="Checkbox" className="cursor-pointer" htmlFor={checkboxId}>
						<div
							className={cn(
								'flex h-6 w-6 items-center justify-center rounded-md border-2 border-primary/60 transition-all duration-300',
								'hover:border-primary/80 hover:shadow-md',
								checked ? 'border-primary bg-primary/20' : 'bg-transparent',
								checkboxClassName
							)}
						>
							<AnimatePresence>
								{checked && (
									<motion.svg
										animate={{ scale: 1, opacity: 1 }}
										className="h-4 w-4 stroke-primary"
										exit={{ scale: 0, opacity: 0 }}
										fill="none"
										initial={{ scale: 0, opacity: 0 }}
										strokeWidth="2.5"
										transition={{ duration: 0.2 }}
										viewBox="0 0 24 24"
									>
										<motion.path
											animate={{ pathLength: 1 }}
											d="M5 12l5 5L20 7"
											initial={{ pathLength: 0 }}
											strokeLinecap="round"
											strokeLinejoin="round"
											transition={{ duration: 0.3 }}
										/>
									</motion.svg>
								)}
							</AnimatePresence>
						</div>
					</label>
				</div>
				{label && (
					<label
						className={cn(
							'cursor-pointer select-none font-medium text-primary/80 transition-colors duration-300',
							'hover:text-primary',
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
