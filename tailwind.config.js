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
					'0%': { backgroundColor: 'rgba(184, 127, 237, 0.6)' },
					'50%': { backgroundColor: 'rgba(184, 127, 237, 0.3)' },
					'100%': { backgroundColor: 'transparent' }
				}
			},
			animation: {
				highlight: 'highlight 2s ease-in-out'
			},
			backgroundImage: {
				'gradient-text': 'linear-gradient(145deg, #b87fed 0%, #601e9e 100%)',
				'gradient-bg': 'linear-gradient(145deg, #06040c 0%, #100a1c 100%)'
			},
			borderRadius: {
				panel: '1rem',
				control: '0.75rem',
				chip: '0.5rem'
			},
			borderColor: {
				line: {
					DEFAULT: '#2d2540',
					soft: '#221b30',
					strong: '#3d3453'
				}
			},
			colors: {
				ink: {
					DEFAULT: '#cfcfcf',
					bright: '#f2eff7',
					muted: '#9a949f',
					faint: '#6f6a75'
				},
				surface: {
					canvas: '#0b0714',
					overlay: '#0d0916',
					inset: '#130f1d',
					panel: '#1a1426',
					raised: '#241d33'
				},
				line: {
					DEFAULT: '#2d2540',
					soft: '#221b30',
					strong: '#3d3453'
				},
				primary: {
					DEFAULT: '#b87fed',
					60: '#78549d',
					30: '#493462',
					dark: '#601e9e'
				},
				twitch: {
					DEFAULT: '#6441a5',
					dark: '#5a3a94'
				},
				danger: {
					DEFAULT: '#e0555b',
					surface: '#3a1f26',
					border: '#6b2f38'
				},
				destructive: {
					DEFAULT: '#c73a44',
					foreground: '#ffffff'
				},
				success: '#3fb27f',
				accent: '#2a2238',
				ring: '#b87fed',
				font: {
					DEFAULT: '#cfcfcf',
					dark: '#7a7a7a'
				},
				muted: {
					foreground: '#9a949f'
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
