import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import React, { useEffect } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import marker from '../../img/marker.svg';
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

const EventMap = ({ data, zoom }) => {
	const longitude = data.longitude || 63;
	const latitude = data.latitude || 90;

	return (
		<MapContainer
			center={[latitude, longitude]}
			zoom={zoom || 3}
			attributionControl={true}
			style={{ height: '100%', width: '100%' }}
		>
			<TileLayer
				url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			/>
			<CustomAttribution />
			<Marker key={data.id} position={[latitude, longitude]}></Marker>
		</MapContainer>
	);
};

export default EventMap;
