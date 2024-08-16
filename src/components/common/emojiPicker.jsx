import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import { IconButton } from '@mui/joy';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import useEmojiData from '../../hooks/useEmoji';
function EmojiPicker({ onSelect }) {
	const [isOpen, setIsOpen] = useState(false);
	const { data, isLoading } = useEmojiData();
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
					<Picker
						data={data}
						locale={'ru'}
						noCountryFlags={true}
						categories={[
							'people',
							'nature',
							'foods',
							'activity',
							'places',
							'objects',
						]}
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
