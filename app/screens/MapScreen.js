import React, { useState, useEffect } from "react";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";
import storage from "../utility/storage";

function MapScreen({ navigation }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    loadMarkers();
  }, []);

  const loadMarkers = async () => {
    const asyncMarkers = await storage.get("asyncMarkers");
    asyncMarkers ? setMarkers(asyncMarkers) : console.log("No saved markers.");
  };

  const storeMarkers = () => {
    storage.store("asyncMarkers", markers);
  };

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
    storeMarkers();
  };

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
      {markers ? (
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
    height: 100,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
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
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 75,
  },
});
