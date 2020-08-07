import React, { useState } from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { FontAwesome5, AntDesign } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import measurementSys from "../config/measurementSys";
import colors from "../config/colors";
import storage from "../utility/storage";

function AddMarkerDetailsScreen({
  markerDetailVisibility,
  pickedLocation,
  markers,
  id,
  setMarkers,
}) {
  const [title, setTitle] = useState();
  const [description, setDesc] = useState();
  const [radius, setRadius] = useState(100);
  const [kmOrMilesRadius, setKmOrMilesRadius] = useState(0.1);
  const [notes, setNotes] = useState();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const removeFirstZero = (value) => {
    const tempArr = value.split("");
    tempArr.splice(0, 1);
    return tempArr.join("");
  };

  const onSubmitMarker = () => {
    markerDetailVisibility();
    markers.push({
      identifier: id,
      circleId: id + "c",
      title: title,
      description: description,
      latlng: pickedLocation,
      radius: radius,
      repeat: isEnabled,
      notes: notes,
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
          <AppTextInput
            placeholder={"Title"}
            onChangeText={(text) => setTitle(text)}
          />
          <AppTextInput
            placeholder={"Description"}
            onChangeText={(text) => setDesc(text)}
          />
          <AppTextInput
            placeholder={"Notes eg. Shopping list..."}
            multiline={true}
            textAlignVertical={"top"}
            spellCheck={true}
            style={styles.notes}
            onChangeText={(text) => setNotes(text)}
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
                maxLength={5}
                keyboardType={"number-pad"}
                value={kmOrMilesRadius.toString()}
                onChangeText={(value) => {
                  //console.log(value[0]);
                  value[0] == "0" &&
                    !isNaN(value[1]) &&
                    (value = removeFirstZero(value));
                  isNaN(parseInt(value)) && (value = 0);
                  setKmOrMilesRadius(value);
                  setRadius(parseFloat(value) * measurementSys.unitDivider);
                }}
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
            onValueChange={(value) => {
              setRadius(value);
              setKmOrMilesRadius(value / measurementSys.unitDivider);
            }}
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
            onPress={() => markerDetailVisibility()}
            style={styles.button}
          >
            <AntDesign name="leftcircleo" color={colors.primary} size={25} />
            <AppText style={styles.iconText}>Go Back</AppText>
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
    marginTop: 400,
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
    backgroundColor: colors.secondary,
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
