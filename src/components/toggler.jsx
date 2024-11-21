import { Box } from '@mui/joy';
import { useState } from 'react';

function Toggler({ defaultExpanded = false, renderToggle, children }) {
	const [open, setOpen] = useState(defaultExpanded);

	return (
		<>
			{renderToggle({ open, setOpen })}
			<Box
				sx={{
					display: 'grid',
					gridTemplateRows: open ? '1fr' : '0fr',
					transition: '0.3s ease',
					'& > *': {
						overflow: 'hidden',
					},
				}}
			>
				{children}
			</Box>
		</>
	);
}
export default Toggler;
