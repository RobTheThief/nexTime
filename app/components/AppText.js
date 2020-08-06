import React from "react";
import { StyleSheet, Text, Platform } from "react-native";

import colors from "../config/colors";

function AppText({ children, style, ...otherProps }) {
  return (
    <Text style={[styles.container, style]} {...otherProps}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    color: colors.primary,
    fontFamily: Platform.OS == "ios" ? "Arial-BoldMT" : "sans-serif-medium",
  },
});

export default AppText;
