import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import { StyleSheet, Button, View, Dimensions } from "react-native";

import storage from "../utility/storage";

function MapScreen({ navigation }) {
  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    const asyncMarkers = await storage.get("asyncMarkers");
    setMarkers(asyncMarkers);
  };

  const [markers, setMarkers] = useState([]);

  const addMarker = (latlng) => {
    const pickedLocation = latlng.nativeEvent.coordinate;
    const id = markers.length + 1;
    markers.push({
      identifier: id,
      title: `Picked Location`,
      description: "Picked Location",
      latlng: pickedLocation,
    });
    setMarkers(markers.map((marker) => marker));
    console.log(markers);
  };

  return (
    <>
      <View style={styles.container}>
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={addMarker}
          style={styles.mapStyle}
        >
          {markers.map((marker) => (
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              key={marker.identifier}
              identifier={marker.identifier.toString()}
              pinColor={marker.pinColor}
              draggable
            />
          ))}
        </MapView>
      </View>

      <Button
        onPress={() => navigation.navigate("Welcome Screen")}
        title="Go to Welcome Screen"
      />
    </>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mapStyle: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
