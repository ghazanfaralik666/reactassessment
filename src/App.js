import React from 'react';
import GoogleMapReact from 'google-map-react';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-autocomplete';
import { useDispatch, useSelector } from 'react-redux';
import { addSearch } from '../store/store';

const MyMapComponent = () => {
  const dispatch = useDispatch();
  const searches = useSelector((state) => state.searches);

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    const placeId = results[0].place_id;
    const apiKey = 'AIzaSyAc5A_hjAoONQoUk8KaAGCyXd9v3Mhm37Q';
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    const place = {
      name: data.result.name,
      address: data.result.formatted_address,
      location: data.result.geometry.location,
    };
    dispatch(addSearch(place));
  };

  const renderSearches = () => {
    return searches.map((search) => (
      <div key={search.location.lat}>
        <p>{search.name}</p>
        <p>{search.address}</p>
      </div>
    ));
  };

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <PlacesAutocomplete
        apiKey="AIzaSyAc5A_hjAoONQoUk8KaAGCyXd9v3Mhm37Q"
        debounce={500}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Search',
              })}
            />
            <div>
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion) => {
                const style = {
                  backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, { style })}
                    key={suggestion.placeId}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <div style={{ height: 'calc(100vh - 50px)', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyAc5A_hjAoONQoUk8KaAGCyXd9v3Mhm37Q' }}
          defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
          defaultZoom={10}
        >
          {searches.map((search) => (
            <div
              key={search.location.lat}
              lat={search.location.lat}
              lng={search.location.lng}
              style={{
                height: '50px',
                width: '50px',
                backgroundColor: 'red',
                borderRadius: '50%',
              }}
            />
          ))}
        </GoogleMapReact>
      </div>
      <div style={{ height: '50px', width: '100%', overflow: 'scroll' }}>
        {renderSearches()}
      </div>
    </div>
  );
};
export default MyMapComponent;