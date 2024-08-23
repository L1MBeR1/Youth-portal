export const darkPalette={
		palette: {
			main:{
				text:"#f5f7fa",
				background:"#00030F",
				primary:"#2240C3",

				surface0:'#111316',
				surface1:'#0C0F14'
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
    		solidHoverBg: '#404d85',//TODO: Свет при наведении добавить нормальный
    		solidHoverBorder: '#404d85',
    		solidActiveBg: 'var(--joy-palette-main-primary)',
    		solidActiveBorder: 'var(--joy-palette-main-primary)',
												"500":"var(--joy-palette-main-primary)"
			},
			text:{
				primary:'var(--joy-palette-main-text)',
				secondary:'var(--joy-palette-main-text)',
				tertiary:'var(--joy-palette-main-text)',
				icon:'var(--joy-palette-main-text)'
			},
			background:{
				body:'var(--joy-palette-main-background)',
				surface:'var(--joy-palette-main-surface1)'
			}
	}
}