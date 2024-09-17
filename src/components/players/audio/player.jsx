import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

function Player({ file }) {
	return <AudioPlayer src={file} showJumpControls={false} volume={0.4} />;
}

export default Player;
