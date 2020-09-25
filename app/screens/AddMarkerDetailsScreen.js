import React, { useEffect, useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import measurementSys from "../config/measurementSys";
import storage from "../utility/storage";
import startCheckLocation from "../utility/startCheckLocation";

function AddMarkerDetailsScreen({
  addMarkerDetailVisibility,
  pickedLocation,
  markers,
  id,
  setMarkers,
}) {
  const [description, setDesc] = useState();
  const [kmOrMilesRadius, setKmOrMilesRadius] = useState(
    markers[id - 1] == undefined
      ? 0.1
      : markers[id - 1].radius / measurementSys.unitDivider
  );
  const [notes, setNotes] = useState();
  const [radius, setRadius] = useState(100);
  const [title, setTitle] = useState();

  const [isEnabled, setIsEnabled] = useState(
    markers[id - 1] == undefined ? false : markers[id - 1].repeat
  );
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const handleChangeText = (value) => {
    isNaN(parseFloat(value)) && (value = "");
    if (value[0] == "0" && !isNaN(value[1])) {
      const tempArr = value.split("");
      tempArr.splice(0, 1);
      value = tempArr.join("");
    }
    setKmOrMilesRadius(value);
    value !== "" && setRadius(parseFloat(value) * measurementSys.unitDivider);
  };

  const handleChangeSlider = (value) => {
    setRadius(value);
    setKmOrMilesRadius(value / measurementSys.unitDivider);
  };

  const handleSubmitMarker = () => {
    if (radius < 100 || title == null)
      return alert(
        "Radius cannot be less than " +
          measurementSys.unitDivider / 10 +
          " " +
          measurementSys.mOrFt +
          " or Title cannot be Empty!"
      );

    const markerObject = {
      identifier: id,
      circleId: id + "c",
      title: title,
      description: description,
      latLng: pickedLocation,
      radius: radius,
      repeat: isEnabled,
      notes: notes,
      date: Date(),
    };

    markers[id - 1] !== undefined
      ? markers.splice(id - 1, 1, markerObject)
      : markers.push(markerObject);

    setMarkers(markers.map((marker) => marker));
    storage.store("asyncMarkers", markers);
    startCheckLocation();
    console.log(markers);
    addMarkerDetailVisibility();
  };

  const handleDeleteMarker = () => {
    Alert.alert(
      "Delete Reminder",
      "Are you sure you want to delete this reminder?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            markers.splice(id - 1, 1);
            for (let i = 0; i < markers.length; i++) {
              markers[i].identifier = i + 1;
              markers[i].circleId = i + 1 + "c";
            }
            storage.store("asyncMarkers", markers);
            startCheckLocation();
            addMarkerDetailVisibility();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const setTitleInputValue = () =>
    markers[id - 1] !== undefined ? markers[id - 1].title : "";
  const setDescInputValue = () =>
    markers[id - 1] !== undefined && markers[id - 1].description
      ? markers[id - 1].description
      : "";
  const setNotesInputValue = () =>
    markers[id - 1] !== undefined && markers[id - 1].notes
      ? markers[id - 1].notes
      : "";
  const setRadiusInputValue = () =>
    markers[id - 1] !== undefined && markers[id - 1].radius
      ? markers[id - 1].radius
      : 100;

  useEffect(() => {
    setTitle(setTitleInputValue);
    setDesc(setDescInputValue);
    setNotes(setNotesInputValue);
    setRadius(setRadiusInputValue);
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View style={styles.inputBox}>
        <View style={styles.inputText}>
          <AppTextInput
            placeholder={"Title"}
            onChangeText={(text) => setTitle(text)}
            defaultValue={setTitleInputValue()}
          />
          <AppTextInput
            placeholder={"Description"}
            onChangeText={(text) => setDesc(text)}
            defaultValue={setDescInputValue()}
          />
          <AppTextInput
            placeholder={"Notes eg. Shopping list..."}
            multiline={true}
            textAlignVertical={"top"}
            spellCheck={true}
            style={styles.notes}
            onChangeText={(text) => setNotes(text)}
            defaultValue={setNotesInputValue()}
          />
          <View style={styles.radiInputandTotal}>
            <AppText style={styles.radiTotal}>
              {radius < measurementSys.unitDivider
                ? "=  " + radius + measurementSys.mOrFt
                : "=  " +
                  radius / measurementSys.unitDivider +
                  measurementSys.kmOrMiles}
            </AppText>

            <View style={styles.radiusInput}>
              <AppTextInput
                style={{ width: "100%" }}
                maxLength={4}
                keyboardType={"number-pad"}
                value={kmOrMilesRadius.toString()}
                onChangeText={(value) => handleChangeText(value)}
                defaultValue={setRadiusInputValue().toString()}
              />
              <AppText style={styles.measureText}>
                {measurementSys.kmOrMiles}
              </AppText>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={100}
            maximumValue={1000}
            step={100}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.black}
            thumbTintColor={colors.primary}
            value={radius}
            onValueChange={(value) => handleChangeSlider(value)}
          />
          <View style={styles.switchContainer}>
            <AppText style={styles.repeatText}>Repeat</AppText>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? colors.primary : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => addMarkerDetailVisibility()}
            style={styles.button}
          >
            <AntDesign name="leftcircleo" color={colors.primary} size={25} />
            <AppText style={styles.iconText}>Go Back</AppText>
          </TouchableOpacity>
          {markers[id - 1] !== undefined && (
            <TouchableOpacity
              onPress={() => handleDeleteMarker()}
              style={styles.button}
            >
              <MaterialCommunityIcons
                name="map-marker-remove-variant"
                size={30}
                color={colors.primary}
              />
              <AppText style={styles.iconText}>Delete</AppText>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => handleSubmitMarker()}
            style={styles.button}
          >
            <FontAwesome5
              name="map-marked-alt"
              size={24}
              color={colors.primary}
            />
            <AppText style={styles.iconText}>Submit</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddMarkerDetailsScreen;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 450,
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
  iconText: {
    paddingLeft: 5,
  },
  inputBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.light,
    padding: 10,
  },
  inputText: {
    width: "90%",
    height: "10%",
    alignItems: "center",
    marginVertical: 15,
  },
  measureText: {
    position: "relative",
    right: 27,
    top: 5,
  },
  notes: {
    borderColor: colors.primary,
    borderWidth: 2,
    height: 200,
    paddingLeft: 5,
    paddingTop: 5,
  },
  repeatText: {
    paddingRight: 20,
    fontSize: 20,
  },
  radiInputandTotal: {
    flexDirection: "row-reverse",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "91%",
  },
  radiTotal: {
    paddingLeft: 13,
    position: "relative",
    bottom: 5,
  },
  radiusInput: {
    width: "30%",
    flexDirection: "row",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  switch: {
    position: "relative",
    top: 2,
  },
  switchContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    flexDirection: "row",
  },
});
