import { extendTheme } from '@mui/joy/styles';
import { darkPalette } from './dark';
import { lightPalette } from './light';

const theme = extendTheme({
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			smx: 750,
			md: 900,
			mdx: 1050,
			lg: 1200,
			lgx: 1350,
			xl: 1536,
			xxl: 2200,
		},
	},
	colorSchemes: {
		light: lightPalette,
		dark: darkPalette,
	},
	staticColors: {
		mainDark: '#121212',
		mainLight: '#fffcf5',
	},
	components: {
		JoyIconButton: {
			styleOverrides: {
				root: {
					borderRadius: '25%',
				},
			},
		},
		JoyButton: {
			styleOverrides: {
				root: {
					borderRadius: '50px',
				},
			},
		},
		JoySelect: {
			styleOverrides: {
				root: {
					borderRadius: '50px',
				},
			},
		},
		JoyAutocomplete: {
			styleOverrides: {
				root: {
					background: 'var(--joy-palette-main-background)',
					borderRadius: '50px',
				},
			},
		},
		JoyInput: {
			styleOverrides: {
				root: {
					background: 'var(--joy-palette-main-background)',
				},
			},
		},
		JoyTextarea: {
			styleOverrides: {
				root: {
					background: 'var(--joy-palette-main-background)',
				},
			},
		},
	},

	focus: {
		default: {
			outline: 'var(--joy-palette-main-primary)',
		},
	},
	typography: {
		h1: {
			fontWeight: '600',
			fontSize: 'clamp(2.5rem,4vw, 5.5rem)',
			lineHeight: '1.2',
		},
		h2: {
			fontWeight: '600',
			fontSize: 'clamp(2rem,3vw, 4rem)',
			lineHeight: '1.2',
		},
		h3: {
			fontWeight: '600',
			fontSize: 'clamp(2.5rem,3vw, 5.5rem)', //TODO:Настроить
			lineHeight: '1.2',
		},
		'publications-h1': {
			fontWeight: '600',
			fontSize: 'clamp(2.5rem,3.4vw, 4.5rem)',
			color: 'var(--joy-palette-main-text)',
			lineHeight: '1.2',
		},
		'publications-h1-white': {
			fontWeight: '900',
			fontSize: 'clamp(2.5rem,3.4vw, 4.5rem)',
			color: 'var(--joy-staticColors-mainLight)',
			lineHeight: '1.2',
		},
		'publications-h2': {
			fontWeight: '600',
			fontSize: 'clamp(1.8rem,2.5vw, 3.2rem)',
			color: 'var(--joy-palette-main-text)',
			lineHeight: '1.2',
		},
		headerButton: {
			fontWeight: '600',
			fontSize: 'clamp(0.85rem,1.5vw, 1.1rem)',
			color: 'var(--joy-palette-main-text)',
		},
		buttonInv: {
			fontWeight: '600',
			fontSize: 'clamp(0.8rem,2vw, 1rem)',
			color: 'var(--joy-palette-text-inverted)',
		},
		'buttonInv-sm': {
			fontWeight: '600',
			fontSize: 'clamp(0.7rem,2vw, 0.9rem)',
			color: 'var(--joy-palette-text-inverted)',
		},
		'title-xxxl': {
			fontWeight: '600',
			fontSize: 'clamp(1.4rem,2.5vw, 2.2rem)',
			color: 'var(--joy-palette-main-text)',
			lineHeight: '1.1',
		},
		'title-xxl': {
			fontWeight: '600',
			fontSize: 'clamp(1.2rem,2.5vw, 1.9rem)',
			color: 'var(--joy-palette-main-text)',
			lineHeight: '1.1',
		},
		'title-xl': {
			fontWeight: '600',
			fontSize: 'clamp(1.1rem,2.5vw, 1.6rem)',
			color: 'var(--joy-palette-main-text)',
			lineHeight: '1.1',
		},
		'title-lg': {
			fontWeight: '600',
			fontSize: 'clamp(1rem,2.5vw, 1.2rem)',
			lineHeight: '1.1',
		},
		'title-md': {
			fontWeight: '600',
			fontSize: 'clamp(1rem,2.5vw, 1.05rem)',
			lineHeight: '1.1',
		},
		'body-lg': {
			fontWeight: '400',
			fontSize: 'clamp(1rem,2.4vw, 1.2rem)',
		},
		'body-md': {
			fontWeight: '400',
			fontSize: 'clamp(1rem,2.2vw, 1.1rem)',
		},
		'body-sm': {
			fontWeight: '400',
			fontSize: 'clamp(0.8rem,2.1vw, 1.05rem)',
		},
		info: {
			fontWeight: '400',
			fontSize: 'clamp(0.7rem,2vw, 0.9rem)',
			color: 'var(--joy-palette-main-text2)',
		},
	},
});

export default theme;
