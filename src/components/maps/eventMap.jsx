import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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

const EventMap = ({ data }) => {
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
			<Marker key={data.id} position={[data.latitude, data.longitude]}></Marker>
		</MapContainer>
	);
};

export default EventMap;
