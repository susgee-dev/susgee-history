/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-text':
					'linear-gradient(145deg, rgba(184, 127, 237, 100%) 0%, rgba(96, 30, 158, 100%) 100%)',
				'gradient-bg': 'linear-gradient(145deg, #000000 0%, #140820 100%)'
			},
			colors: {
				primary: {
					DEFAULT: 'rgba(184, 127, 237, 100%)',
					30: 'rgba(184, 127, 237, 30%)',
					60: 'rgba(184, 127, 237, 60%)',
					dark: 'rgba(96, 30, 158, 100%)'
				},
				font: {
					DEFAULT: '#cfcfcf',
					light: '#e0e0e0',
					dark: '#7a7a7a'
				},
				muted: {
					foreground: 'hsl(0 0% 50% / <alpha-value>)'
				},
			}
		}
	},
	darkMode: 'class',
	plugins: []
};

export default config;
