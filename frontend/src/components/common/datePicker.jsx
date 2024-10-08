import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { FormControl, FormLabel, Input, Sheet } from '@mui/joy';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { ArrowContainer, Popover } from 'react-tiny-popover';

function DatePicker({ label, value, placeholder, size, sx, onChange }) {
	const [isOpen, setIsOpen] = useState(false);

	const handleDateSelect = date => {
		onChange(date);
		setIsOpen(false);
	};

	return (
		<Popover
			isOpen={isOpen}
			positions={['bottom', 'left', 'right', 'top']}
			padding={5}
			align='center'
			content={({ position, childRect, popoverRect }) => (
				<ArrowContainer
					position={position}
					childRect={childRect}
					popoverRect={popoverRect}
					arrowColor={'var(--joy-palette-main-background)'}
					arrowSize={15}
					className='popover-arrow-container'
					arrowClassName='popover-arrow'
				>
					<Sheet
						sx={{
							padding: '15px',
							borderRadius: '30px',
							background: 'var(--joy-palette-main-background)',
						}}
					>
						<DayPicker
							captionLayout='dropdown'
							locale={ru}
							mode='single'
							selected={value}
							onSelect={handleDateSelect}
							firstWeekContainsDate={1}
							weekStartsOn={1}
						/>
					</Sheet>
				</ArrowContainer>
			)}
			onClickOutside={() => setIsOpen(false)}
		>
			<FormControl size={size}>
				<FormLabel>{label}</FormLabel>
				<Input
					sx={sx}
					readOnly
					onFocus={e => {
						e.target.blur();
					}}
					onClick={() => {
						setIsOpen(true);
					}}
					placeholder={placeholder}
					value={value ? format(value, 'dd.MM.yyyy') : ''}
					endDecorator={<CalendarTodayIcon />}
				/>
			</FormControl>
		</Popover>
	);
}

export default DatePicker;
