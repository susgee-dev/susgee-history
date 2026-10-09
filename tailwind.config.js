/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			keyframes: {
				highlight: {
					'0%': { backgroundColor: 'color-mix(in srgb, var(--primary) 60%, transparent)' },
					'50%': { backgroundColor: 'color-mix(in srgb, var(--primary) 30%, transparent)' },
					'100%': { backgroundColor: 'transparent' }
				}
			},
			animation: {
				highlight: 'highlight 2s ease-in-out'
			},
			backgroundImage: {
				'gradient-text': 'var(--gradient-text)',
				'gradient-bg': 'var(--gradient-bg)'
			},
			borderRadius: {
				panel: 'var(--radius-panel)',
				control: 'var(--radius-control)',
				chip: 'var(--radius-chip)'
			},
			borderColor: {
				line: {
					DEFAULT: 'var(--line)',
					soft: 'var(--line-soft)',
					strong: 'var(--line-strong)'
				}
			},
			colors: {
				ink: {
					DEFAULT: 'var(--ink)',
					bright: 'var(--ink-bright)',
					muted: 'var(--ink-muted)',
					faint: 'var(--ink-faint)'
				},
				surface: {
					canvas: 'var(--surface-canvas)',
					overlay: 'var(--surface-overlay)',
					inset: 'var(--surface-inset)',
					panel: 'var(--surface-panel)',
					raised: 'var(--surface-raised)'
				},
				line: {
					DEFAULT: 'var(--line)',
					soft: 'var(--line-soft)',
					strong: 'var(--line-strong)'
				},
				primary: {
					DEFAULT: 'var(--primary)',
					60: 'var(--primary-60)',
					30: 'var(--primary-30)',
					dark: 'var(--primary-dark)'
				},
				twitch: {
					DEFAULT: 'var(--twitch)',
					dark: 'var(--twitch-dark)'
				},
				danger: {
					DEFAULT: 'var(--danger)',
					surface: 'var(--danger-surface)',
					border: 'var(--danger-border)'
				},
				destructive: {
					DEFAULT: 'var(--destructive)',
					foreground: 'var(--destructive-foreground)'
				},
				success: 'var(--success)',
				accent: 'var(--accent)',
				ring: 'var(--ring)',
				font: {
					DEFAULT: 'var(--ink)',
					dark: 'var(--ink-muted)'
				},
				muted: {
					foreground: 'var(--ink-muted)'
				}
			},
			fontFamily: {
				data: [
					'var(--font-jetbrains-mono)',
					'ui-monospace',
					'SFMono-Regular',
					'Menlo',
					'monospace'
				]
			}
		}
	},
	darkMode: 'class',
	plugins: []
};

export default config;
