import MapView, { Marker, Circle } from "react-native-maps";
import React, { useState, useEffect } from "react";
import { StyleSheet} from "react-native";

import AppHeader from '../components/AppHeader';
import AddMarkerDetailsScreen from "./AddMarkerDetailsScreen";
import colors from "../config/colors";
import helpers from '../utility/helpers';
import storage from "../utility/storage";

var lastAsyncReminder;
var markerIntervalClass;

function MapScreen({ navigation, themeState, numSystem, setNumSystem }) {

  const [reRenderMap, setReRenderMap] = useState(1) //MapView Bug workaround

  const [markers, setMarkers] = useState([]);

  const loadMarkers = async () => {
    const asyncMarkers = await storage.get("asyncMarkers");
    asyncMarkers ? setMarkers(asyncMarkers) : setMarkers([]);
  };

  useEffect(() => {
    setReRenderMap(1) //MapView Bug workaround
    setNumSystem(storage.getOptions().measurementSys);
    loadMarkers();
    helpers.loadReminderInterval("asyncMarkers", lastAsyncReminder, setMarkers, markerIntervalClass);
    markerIntervalClass = 'once is enough thanks';
  }, [reRenderMap]);

  const addMarker = async (latlng) => {
    addMarkerDetailVisibility();
    setPickedLocation(latlng.nativeEvent.coordinate);
    setId(markers.length + 1);
  };

  const setDetails = (e) => {
    setId(e.nativeEvent.id);
    setPickedLocation(e.nativeEvent.coordinate);
  };

  const [visible, setVisible] = useState(false);
  const addMarkerDetailVisibility = () =>{
    visible && loadMarkers();
    visible ? setVisible(false) : setVisible(true);
}
  const [pickedLocation, setPickedLocation] = useState();
  const [id, setId] = useState();

  return (
    <>
      <AppHeader themeState={themeState} navigation={ navigation }/>
      {visible ? (
        <AddMarkerDetailsScreen
          addMarkerDetailVisibility={addMarkerDetailVisibility}
          id={id}
          pickedLocation={pickedLocation}
          markers={markers}
          setMarkers={setMarkers}
          themeState={themeState}
          numSystem={numSystem}
          setNumSystem={setNumSystem}
        />
      ) : markers ? (
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={addMarker}
          style={[styles.mapStyle, {flex: reRenderMap}]}
          onMapReady={()=> reRenderMap === 1 && setReRenderMap(0)} //Workaround for MapView bug with showsMyLocationButton to rerender map
        >
          {markers.map((marker) => (
            <React.Fragment key={marker.id}>
              <Marker
                coordinate={marker.latLng}
                title={marker.title}
                description={marker.description}
                key={marker.id}
                identifier={marker.id.toString()}
                pinColor={marker.pinColor}
                onPress={setDetails}
                onCalloutPress={addMarkerDetailVisibility}
              />
              <Circle
                center={marker.latLng}
                radius={parseInt(marker.radius, 10)}
                key={marker.circleId}
                identifier={marker.circleId.toString()}
                fillColor={colors.circle}
              />
            </React.Fragment>
          ))}
        </MapView>
      ) : (
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={addMarker}
          style={[styles.mapStyle, {flex: reRenderMap}]}
          onMapReady={()=> reRenderMap === 1 && setReRenderMap(0)} //Workaround for MapView bug with showsMyLocationButton to rerender map
        ></MapView>
      )}
    </>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  mapStyle: {
    width: "100%",
    height: "100%",
  },
});

