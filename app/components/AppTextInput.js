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
      placeholderTextColor={colors.primaryLight}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      selectionColor={colors.primaryLight}
    />
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: colors.primaryLight,
    marginBottom: 20,
    width: "100%",
    color: colors.secondary,
  },
});

export default AppTextInput;
