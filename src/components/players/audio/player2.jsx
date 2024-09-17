import React, { useState } from 'react';
import ReactPlayer from 'react-player';

function Player({ file }) {
	const [duration, setDuration] = useState(0);

	const handleDuration = duration => {
		setDuration(duration);
		console.log('Track Duration: ', duration);
	};

	return (
		<div>
			<ReactPlayer
				url={file}
				controls
				volume={0.4}
				width='100%'
				height='50px'
				onDuration={handleDuration}
			/>
			<p>Track Duration: {duration.toFixed(2)} seconds</p>{' '}
		</div>
	);
}

export default Player;
