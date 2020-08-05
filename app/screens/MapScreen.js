import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";
import storage from "../utility/storage";

function MapScreen({ navigation }) {
  const [visible, setVisible] = useState(false);
  const visibility = () => (visible ? setVisible(false) : setVisible(true));

  const [markers, setMarkers] = useState([]);

  const loadMarkers = async () => {
    const asyncMarkers = await storage.get("asyncMarkers");
    asyncMarkers ? setMarkers(asyncMarkers) : console.log("No saved markers.");
  };

  useEffect(() => {
    loadMarkers();
  }, []);

  const addMarker = async (latlng) => {
    visibility();
    setPickedLocation(latlng.nativeEvent.coordinate);
    setId(markers.length + 1);
  };

  const onSubmitMarker = () => {
    visibility();
    markers.push({
      identifier: id,
      title: title,
      description: description,
      latlng: pickedLocation,
    });
    setMarkers(markers.map((marker) => marker));
    storage.store("asyncMarkers", markers);
  };

  const [title, onChangeTitle] = useState();
  const [pickedLocation, setPickedLocation] = useState();
  const [id, setId] = useState();
  const [description, onChangeDesc] = useState();

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
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
          enabled={Platform.OS === "ios" ? true : false}
        >
          <View style={styles.inputBox}>
            <View style={styles.inputText}>
              <TextInput
                style={styles.textInput}
                placeholder={"Title"}
                onChangeText={(text) => onChangeTitle(text)}
                onSubmitEditing={() => {
                  onSubmitMarker();
                }}
              />
              <TextInput
                style={styles.textInput}
                placeholder={"Description"}
                onChangeText={(text) => onChangeDesc(text)}
                onSubmitEditing={() => {
                  onSubmitMarker();
                }}
              />
            </View>

            <View style={styles.buttons}>
              <TouchableOpacity
                onPress={() => visibility()}
                style={styles.button}
              >
                <AntDesign
                  name="leftcircleo"
                  color={colors.primary}
                  size={25}
                />
                <Text style={{ paddingLeft: 5, color: colors.primary }}>
                  Go Back
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onSubmitMarker()}
                style={styles.button}
              >
                <FontAwesome5
                  name="map-marked-alt"
                  size={24}
                  color={colors.primary}
                />
                <Text style={{ paddingLeft: 5, color: colors.primary }}>
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
  buttons: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    flex: 1,
    width: "100%",
    position: "relative",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
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
  inputBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.secondary,
    padding: 10,
  },
  inputText: {
    width: "90%",
    height: "10%",
    alignItems: "center",
    marginVertical: 15,
  },
  mapStyle: {
    width: "100%",
    height: "100%",
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 20,
    width: "100%",
  },
});
