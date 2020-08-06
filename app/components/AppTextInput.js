import React from "react";
import { StyleSheet, TextInput } from "react-native";

import colors from "../config/colors";

function AppTextInput({ placeholder, onChangeText, keyboardType }) {
  return (
    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      onSubmitEditing={() => {
        onSubmitMarker();
      }}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 20,
    width: "100%",
  },
});

export default AppTextInput;
