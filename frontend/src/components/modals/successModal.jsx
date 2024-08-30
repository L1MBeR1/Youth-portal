import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/joy/IconButton';
import LinearProgress from '@mui/joy/LinearProgress';
import Snackbar from '@mui/joy/Snackbar';
import Stack from '@mui/joy/Stack';
import React, { useEffect, useState } from 'react';

function SuccessModal({ open, setOpen, message, position, icon }) {
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let timer;
		if (open) {
			setProgress(0);
			timer = setInterval(() => {
				setProgress(prevProgress => {
					if (prevProgress >= 100) {
						clearInterval(timer);
						return 100;
					}
					return prevProgress + 0.5;
				});
			}, 15);
		} else {
			setProgress(0);
		}

		return () => {
			if (timer) {
				clearInterval(timer);
			}
		};
	}, [open]);
	const handleClose = () => {
		setOpen(false);
		setProgress(0);
	};
	return (
		<>
			<Snackbar
				autoHideDuration={3000}
				variant='soft'
				color='success'
				open={open}
				onClose={(event, reason) => {
					if (reason === 'clickaway') {
						return;
					}
					handleClose();
				}}
				anchorOrigin={position}
				sx={{ p: 0 }}
			>
				<Stack
					direction='column'
					alignItems='stretch'
					spacing={0}
					sx={{
						width: '100%',
					}}
				>
					<Stack
						direction='row'
						justifyContent='space-between'
						alignItems='center'
						gap={2}
						p={1}
					>
						{icon}
						{message}
						<IconButton
							onClick={() => handleClose()}
							size='sm'
							variant='soft'
							color='success'
						>
							<CloseIcon />
						</IconButton>
					</Stack>
					<LinearProgress
						size='sm'
						color='success'
						determinate
						value={progress}
					/>
				</Stack>
			</Snackbar>
		</>
	);
}

export default SuccessModal;
