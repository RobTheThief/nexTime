import {
  FontAwesome5,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";

import appTasks from "../utility/appTasks";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import measurementSys from "../config/measurementSys";
import storage from "../utility/storage";

function AddMarkerDetailsScreen({
  addMarkerDetailVisibility,
  pickedLocation,
  markers,
  id,
  setMarkers,
  themeState,
  numSystem }) {

  const milesToMeters = (radius) => {
    return radius / 0.00062137;
  } 

  const metersTofeetRadius = (radius) => {
    return radius * 3.2808;
  }

  const [description, setDesc] = useState();
  const [kmOrMilesRadius, setKmOrMilesRadius] = useState(
    markers[id - 1] == undefined
      ? (numSystem === 'metric' ? 0.1 : 0.01893)
      : (markers[id - 1].numSystem == 'imperial' ?
      metersTofeetRadius(markers[id - 1].radius) 
      : markers[id - 1].radius) / measurementSys.numRules[numSystem].unitDivider
  );

  const [notes, setNotes] = useState();
  const [radius, setRadius] = useState(100);
  const [title, setTitle] = useState();

  const [repeatReminder, setRepeatReminder] = useState(
    markers[id - 1] == undefined ? false : markers[id - 1].repeat
  );
  const toggleRepeat = () => {
    setRepeatReminder((previousState) => !previousState);
    if (deleteOnTrig === true) toggleDelete();
  };

  const [deleteOnTrig, setDeleteOnTrig] = useState(
    markers[id - 1] == undefined ? false : markers[id - 1].delete
  );
  const toggleDelete = () => setDeleteOnTrig((previousState) => !previousState);

  const getTitleInputValue = () =>
    markers[id - 1] !== undefined ? markers[id - 1].title : undefined;
  const getDescInputValue = () =>
    markers[id - 1] !== undefined && markers[id - 1].description
      ? markers[id - 1].description
      : undefined;
  const getNotesInputValue = () =>
    markers[id - 1] !== undefined && markers[id - 1].notes
      ? markers[id - 1].notes
      : undefined;
  const getRadiusInputValue = () =>
    markers[id - 1] !== undefined && markers[id - 1].radius
      ?  (markers[id - 1].numSystem == 'imperial' ? metersTofeetRadius(markers[id - 1].radius) 
        : markers[id - 1].radius)
      : 100;

  useEffect(() => {
    setTitle(getTitleInputValue);
    setDesc(getDescInputValue);
    setNotes(getNotesInputValue);
    setRadius(getRadiusInputValue);
  }, []);

  const handleChangeRadiusText = (value) => {
    isNaN(parseFloat(value)) && (value = "");
    if (value[0] == "0" && !isNaN(value[1])) {
      const tempArr = value.split("");
      tempArr.splice(0, 1);
      value = tempArr.join("");
    }
    setKmOrMilesRadius(value);
    value !== "" && setRadius(parseFloat(value) * measurementSys.numRules[numSystem].unitDivider);
  };

  const handleChangeSlider = (value) => {
    setRadius(value);
    setKmOrMilesRadius(value / measurementSys.numRules[numSystem].unitDivider);
  };

  const handleSubmitMarker = () => {
    if (radius < measurementSys.numRules[numSystem].unitDivider / 10 || title == null)
      return Alert.alert('nexTime',
        "Radius cannot be less than " +
        measurementSys.numRules[numSystem].unitDivider / 10 +
          " " +
          measurementSys.numRules[numSystem].mOrFt +
          " or Title cannot be Empty!"
      );
      
    const markerObject = {
      id: id,
      circleId: id + "c",
      title: title,
      description: description,
      latLng: pickedLocation,
      radius: numSystem === 'imperial' ? milesToMeters(kmOrMilesRadius) : radius,
      repeat: repeatReminder,
      delete: deleteOnTrig,
      notes: notes,
      taskDeleted: false,
      numSystem: numSystem,
    };

    markers[id - 1] !== undefined
      ? markers.splice(id - 1, 1, markerObject)
      : markers.push(markerObject);

    setMarkers(markers.map((marker) => marker));
    storage.store("asyncMarkers", markers);
    addMarkerDetailVisibility();
    appTasks.isServiceRunning();
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
          onPress: async () => {
            markers.splice(id - 1, 1);
            for (let i = 0; i < markers.length; i++) {
              markers[i].id = i + 1;
              markers[i].circleId = i + 1 + "c";
            }
            markers.length === 0 ? 
            await storage.store("asyncMarkers", []) :
            await storage.store("asyncMarkers", markers);
            addMarkerDetailVisibility();
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
      enabled={Platform.OS === "ios" ? true : false}
    >
      <View style={[styles.inputBox, colors.mode[themeState].main]}>
        <View style={styles.inputTextContainer}>
          <AppTextInput
            placeholder={"Title"}
            onChangeText={(text) => {
              if (text === "") text = undefined;
              setTitle(text);
            }}
            defaultValue={getTitleInputValue()}
          />
          <AppTextInput
            placeholder={"Description (Displayed in callout on Map Screen)"}
            onChangeText={(text) => setDesc(text)}
            defaultValue={getDescInputValue()}
          />
          <AppTextInput
            placeholder={"Notes eg. Shopping list..."}
            multiline={true}
            textAlignVertical={"top"}
            spellCheck={true}
            style={styles.notes}
            onChangeText={(text) => setNotes(text)}
            defaultValue={getNotesInputValue()}
          />
          <View style={styles.radiInputandTotal}>
            <AppText style={styles.radiTotal}>
              {radius < measurementSys.numRules[numSystem].unitDivider
                ? "=  " + radius + measurementSys.numRules[numSystem].mOrFt
                : "=  " +
                  radius / measurementSys.numRules[numSystem].unitDivider +
                  measurementSys.numRules[numSystem].kmOrMiles}
            </AppText>

            <View style={styles.radiusInput}>
              <AppTextInput
                style={styles.radiTextInput}
                maxLength={7}
                keyboardType={"number-pad"}
                value={kmOrMilesRadius.toString()}
                onChangeText={(value) => handleChangeRadiusText(value)}
                defaultValue={radius.toString()}
              />
              <AppText style={styles.measureText}>
                {measurementSys.numRules[numSystem].kmOrMiles}
              </AppText>
            </View>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={100}
            maximumValue={1000}
            step={100}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.mode[themeState].slider}
            thumbTintColor={colors.primary}
            value={radius}
            onValueChange={(value) => handleChangeSlider(value)}
          />
          <View style={styles.switchBox}>
            <View style={styles.switchContainer}>
              <AppText style={[styles.switchText, colors.mode[themeState].switchText]}>Repeat</AppText>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={repeatReminder ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleRepeat}
                value={repeatReminder}
              />
            </View>
            <View style={styles.switchContainer}>
              <AppText style={[styles.switchText, colors.mode[themeState].switchText]}>Delete on Trigger</AppText>
              <Switch
                style={styles.switch}
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={deleteOnTrig ? colors.primary : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleDelete}
                value={deleteOnTrig}
                disabled={repeatReminder}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => addMarkerDetailVisibility()}
            style={styles.button}
          >
            <AntDesign name="leftcircle" color={colors.primary} size={29} />
            <AppText style={[styles.buttonText, colors.mode[themeState].buttonText]}>Go Back</AppText>
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
              <AppText style={[styles.buttonText, colors.mode[themeState].buttonText]}>Delete</AppText>
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
            <AppText style={[styles.buttonText, colors.mode[themeState].buttonText]}>Submit</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default AddMarkerDetailsScreen;

const styles = StyleSheet.create({
  buttons: {
    marginTop: 440,
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
  buttonText: {
    paddingLeft: 5,
    fontSize: 15,
  },
  inputBox: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: colors.light,
  },
  inputTextContainer: {
    width: "90%",
    height: "10%",
    alignItems: "center",
    marginVertical: 15,
  },
  measureText: {
    position: "relative",
    right: 27,
    top: 15,
  },
  notes: {
    borderColor: colors.primary,
    borderWidth: 2,
    height: 200,
    paddingLeft: 5,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderWidth: 1,
    borderColor: colors.primaryLight,
  },
  switchText: {
    paddingRight: 20,
    fontSize: 17,
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
  radiTextInput: {
     width: "100%",
     marginBottom: 10,
     borderBottomWidth: 1,
     borderBottomColor: colors.primaryLight
  },
  radiusInput: {
    width: "30%",
    flexDirection: "row",
  },
  switchBox: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    position: 'relative',
    bottom: 20,
  },
  switch: {
    position: "relative",
    top: 2,
  },
  switchContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 5,
  },
  slider: {
    width: "100%",
    height: 80,
    position:'relative',
    bottom: 10,
  },
});
