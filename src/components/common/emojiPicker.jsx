import React, { useState } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Popover, ArrowContainer } from 'react-tiny-popover';
import { IconButton } from '@mui/joy';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
function EmojiPicker() {
	const [isOpen, setIsOpen] = useState(false);

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
					arrowColor={'#ffffff'}
					arrowSize={10}
					className='popover-arrow-container'
					arrowClassName='popover-arrow'
				>
					<Picker data={data} locale={'ru'} onEmojiSelect={console.log} />;
				</ArrowContainer>
			)}
			onClickOutside={() => setIsOpen(false)}
		>
			<IconButton
				size='lg'
				sx={{
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
