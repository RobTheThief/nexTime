import React from "react";
import { StyleSheet, TextInput } from "react-native";

import colors from "../config/colors";

function AppTextInput({
  placeholder,
  onChangeText,
  keyboardType,
  onSubmitEditing,
  style,
  ...otherProps
}) {
  return (
    <TextInput
      {...otherProps}
      style={[styles.textInput, style]}
      placeholder={placeholder}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
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
