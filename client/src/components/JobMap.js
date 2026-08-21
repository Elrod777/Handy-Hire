import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const JobMap = ({ jobs, onMarkerClick }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px'
  };

  const defaultCenter = {
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={12}>
        {jobs.map((job) => (
          <Marker
            key={job.id}
            position={{
              lat: parseFloat(job.location_latitude),
              lng: parseFloat(job.location_longitude)
            }}
            onClick={() => onMarkerClick(job)}
            title={job.title}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default JobMap;