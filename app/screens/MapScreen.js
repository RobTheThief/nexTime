import React, { useState, useEffect } from "react";
import MapView, { Marker, Circle } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import AddMarkerDetailsScreen from "./AddMarkerDetailsScreen";
import colors from "../config/colors";
import storage from "../utility/storage";

function MapScreen({ navigation }) {
  const [markers, setMarkers] = useState([]);

  const loadMarkers = async () => {
    const asyncMarkers = await storage.get("asyncMarkers");
    asyncMarkers ? setMarkers(asyncMarkers) : console.log("No saved markers.");
  };

  useEffect(() => {
    loadMarkers();
  });

  const addMarker = async (latlng) => {
    addMarkerDetailVisibility();
    setPickedLocation(latlng.nativeEvent.coordinate);
    setId(markers.length + 1);
  };

  const setDetails = (e) => {
    setId(e.nativeEvent.id);
    setPickedLocation(e.nativeEvent.coordinate);
    console.log(pickedLocation, id);
  };

  const [visible, setVisible] = useState(false);
  const addMarkerDetailVisibility = () =>
    visible ? setVisible(false) : setVisible(true);

  const [pickedLocation, setPickedLocation] = useState();
  const [id, setId] = useState();

  return (
    <>
      <View style={styles.headContainer}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerButton}
        >
          <AntDesign name="rightcircleo" color={colors.light} size={25} />
        </TouchableOpacity>

        <View style={styles.headTextContainer}>
          <Text style={styles.headText}>Map</Text>
        </View>
      </View>

      {visible ? (
        <AddMarkerDetailsScreen
          addMarkerDetailVisibility={addMarkerDetailVisibility}
          id={id}
          pickedLocation={pickedLocation}
          markers={markers}
          setMarkers={setMarkers}
        />
      ) : markers ? (
        <MapView
          showsUserLocation={true}
          showsMyLocationButton={true}
          onPress={addMarker}
          style={styles.mapStyle}
        >
          {markers.map((marker) => (
            <React.Fragment key={marker.markerIndex}>
              <Marker
                coordinate={marker.latLng}
                title={marker.title}
                description={marker.description}
                key={marker.markerIndex}
                identifier={marker.markerIndex.toString()}
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
          style={styles.mapStyle}
        ></MapView>
      )}
    </>
  );
}

export default MapScreen;

const styles = StyleSheet.create({
  headContainer: {
    height: "10%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderBottomColor: colors.black,
    borderBottomWidth: 2,
  },
  drawerButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    position: "relative",
    top: -7,
    right: 70,
  },
  headTextContainer: {
    fontSize: 30,
    fontWeight: "600",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: -10,
    right: 100,
  },
  headText: {
    color: colors.light,
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
});
