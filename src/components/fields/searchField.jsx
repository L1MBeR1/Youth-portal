import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Input } from '@mui/joy';
import React from 'react';

const SearchField = ({ searchValue, setSearchValue, sx, size, onClear }) => {
	const handleClear = () => {
		setSearchValue('');
		if (onClear) {
			onClear();
		}
	};

	return (
		<Input
			placeholder='Поиск...'
			size={size}
			startDecorator={<SearchIcon />}
			endDecorator={
				searchValue && (
					<IconButton variant='plain' color='neutral' onClick={handleClear}>
						<ClearIcon />
					</IconButton>
				)
			}
			value={searchValue}
			onChange={e => setSearchValue(e.target.value)}
			sx={sx}
		/>
	);
};

export default SearchField;
