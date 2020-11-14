import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import colors from "../config/colors";


function AppHeader({ navigation, style, themeState}) {

    return (
        <View style={[styles.headContainer, colors.mode[themeState].appHeader, style]}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={styles.drawerButton}
          >
            <AntDesign name="menuunfold" color={colors.light} size={30} />
          </TouchableOpacity>

          <View style={styles.headTextContainer}>
            <Text style={styles.headText}></Text>
          </View>
      </View>
    );
}

const styles = StyleSheet.create({
  drawerButton: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 20,
    },
  headContainer: {
    height: "10%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderBottomColor: colors.black,
    borderBottomWidth: 2,
  },
  headTextContainer: {
    fontSize: 30,
    fontWeight: "600",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: -10,
    right: 100,
  },
  headText: {
    color: colors.light,
  },
})

export default AppHeader;