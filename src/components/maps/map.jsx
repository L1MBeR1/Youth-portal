import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import marker from '../../img/marker.svg';
import EventMarkerCard from '../homeComponents/eventContainer/eventMarkerCard';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: marker,
	iconUrl: marker,
	shadowUrl: '',
});

const CustomAttribution = () => {
	const map = useMap();
	useEffect(() => {
		map.attributionControl.setPrefix(false);
	}, [map]);
	return null;
};

const Map = props => {
	return (
		<MapContainer
			center={[63, 90]}
			zoom={3}
			attributionControl={true}
			style={{ height: '100%', width: '100%' }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<CustomAttribution />
			{props.markers.map((marker, index) => (
				<Marker key={index} position={[marker.latitude, marker.longitude]}>
					<Popup>
						<EventMarkerCard data={marker} />
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default Map;
