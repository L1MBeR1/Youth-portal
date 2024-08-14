import React, { useState, Suspense } from 'react';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import { IconButton, CircularProgress, Box, Stack } from '@mui/joy';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

const Picker = React.lazy(() => import('@emoji-mart/react'));

function EmojiPicker({ onSelect }) {
	const [isOpen, setIsOpen] = useState(false);
	const [data, setData] = useState(null);

	useState(() => {
		import('@emoji-mart/data').then(module => {
			setData(module.default);
		});
	}, []);

	const exceptEmojis = ['rainbow-flag', 'rainbow'];

	return (
		<Popover
			isOpen={isOpen}
			positions={['left', 'bottom', 'right', 'top']}
			padding={10}
			align='start'
			content={({ position, childRect, popoverRect }) => (
				<ArrowContainer
					position={position}
					childRect={childRect}
					popoverRect={popoverRect}
					arrowColor={'#f1f1f1'}
					arrowSize={10}
					className='popover-arrow-container'
					arrowClassName='popover-arrow'
				>
					<Suspense
						fallback={
							<Stack
								sx={{
									width: '100px',
									height: '200px',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<CircularProgress color='neutral' />
							</Stack>
						}
					>
						{data && (
							<Picker
								data={data}
								categories={[
									'people',
									'nature',
									'foods',
									'activity',
									'places',
									'objects',
								]}
								locale={'ru'}
								noCountryFlags={true}
								onEmojiSelect={emoji => {
									onSelect(emoji.native);
									setIsOpen(false);
								}}
								searchPosition={'none'}
								previewPosition={'none'}
								perLine={7}
								exceptEmojis={exceptEmojis}
								navPosition={'none'}
							/>
						)}
					</Suspense>
				</ArrowContainer>
			)}
			onClickOutside={() => setIsOpen(false)}
		>
			<IconButton
				sx={{
					paddingX: { xs: '7px', md: '8px' },
					'--IconButton-size': { xs: '30px', md: '45px' },
					borderRadius: '50px',
				}}
				onClick={() => setIsOpen(!isOpen)}
			>
				<SentimentSatisfiedAltIcon />
			</IconButton>
		</Popover>
	);
}

export default EmojiPicker;
