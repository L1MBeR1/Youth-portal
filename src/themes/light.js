export const lightPalette={
		palette: {
			main:{
				text:"#121212",
				text2:"#878787",
				text3:"#4e4e4e",

				background:"#fffefb",
				primary:"#1E46E6",

				surface0:'#1E1E24',
				surface1:'#fef3e5'
			},
			neutral: {

				solidBg: 'var(--joy-palette-main-text)',
   			solidBorder: 'var(--joy-palette-main-text)',
    		solidHoverBg: '#323437',
    		solidHoverBorder: '#323437',
    		solidActiveBg: 'var(--joy-palette-main-text)',
    		solidActiveBorder: 'var(--joy-palette-main-text)',
    		// solidDisabledBg: '#6c757d',
    		// solidDisabledBorder: '#6c757d',
			},
			primary: {

				solidBg: 'var(--joy-palette-main-primary)',
   			solidBorder: 'var(--joy-palette-main-primary)',
    		solidHoverBg: '#1e389f',//TODO: Свет при наведении добавить нормальный
    		solidHoverBorder: '#1e389f',
    		solidActiveBg: 'var(--joy-palette-main-primary)',
    		solidActiveBorder: 'var(--joy-palette-main-primary)',
				// softDisabledBg: '#6c757d',
    		softDisabledBorder: 'var(--joy-palette-main-primary)',
								500:"#1E46E6"
			},
			text:{
				primary:'var(--joy-palette-main-text)',
				secondary:'var(--joy-palette-main-text3)',
				tertiary:'var(--joy-palette-main-text)',
				icon:'var(--joy-palette-main-text)',
				inverted:'var(--joy-palette-main-background)',
			},
			background:{
				body:'var(--joy-palette-main-background)',
				surface:'var(--joy-palette-main-surface1)'
			}
		}
}