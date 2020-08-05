import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";
import storage from "../utility/storage";
import AddMarkerDetailsScreen from "./AddMarkerDetailsScreen";

function MapScreen({ navigation }) {
  const [markers, setMarkers] = useState([]);

  const loadMarkers = async () => {
    const asyncMarkers = await storage.get("asyncMarkers");
    asyncMarkers ? setMarkers(asyncMarkers) : console.log("No saved markers.");
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  const addMarker = async (latlng) => {
    markerDetailVisibility();
    setPickedLocation(latlng.nativeEvent.coordinate);
    setId(markers.length + 1);
  };

  const [visible, setVisible] = useState(false);
  const markerDetailVisibility = () =>
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
          <AntDesign name="rightcircleo" color={colors.black} size={25} />
        </TouchableOpacity>

        <View style={styles.headText}>
          <Text>Map</Text>
        </View>
      </View>

      {visible ? (
        <AddMarkerDetailsScreen
          markerDetailVisibility={markerDetailVisibility}
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
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              key={marker.identifier}
              identifier={marker.identifier.toString()}
              pinColor={marker.pinColor}
            />
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
  headText: {
    fontSize: 30,
    fontWeight: "600",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: -10,
    right: 100,
  },

  mapStyle: {
    width: "100%",
    height: "100%",
  },
});
