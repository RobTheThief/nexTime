import React, { useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";
import storage from "../utility/storage";

function AddMarkerDetailsScreen({
  markerDetailVisibility,
  pickedLocation,
  markers,
  id,
  setMarkers,
}) {
  const [title, onChangeTitle] = useState();
  const [description, onChangeDesc] = useState();
  const [radius, onChangeRadius] = useState();

  const onSubmitMarker = () => {
    markerDetailVisibility();
    markers.push({
      identifier: id,
      circleId: id + "c",
      title: title,
      description: description,
      latlng: pickedLocation,
      radius: radius,
    });
    setMarkers(markers.map((marker) => marker));
    storage.store("asyncMarkers", markers);
  };

  return (
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
          <TextInput
            style={styles.textInput}
            keyboardType={"number-pad"}
            placeholder={"Radius"}
            onChangeText={(text) => onChangeRadius(text)}
            onSubmitEditing={() => {
              onSubmitMarker();
            }}
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => markerDetailVisibility()}
            style={styles.button}
          >
            <AntDesign name="leftcircleo" color={colors.primary} size={25} />
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
  );
}

export default AddMarkerDetailsScreen;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 70,
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
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 20,
    width: "100%",
  },
});
