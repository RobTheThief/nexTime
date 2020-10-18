import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import { AntDesign } from "@expo/vector-icons";


function AppHeader({ navigation }) {
    return (
        <View style={styles.headContainer}>
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.drawerButton}
        >
          <AntDesign name="rightcircleo" color={colors.light} size={25} />
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
        flex: 1,
        position: "relative",
        top: -20,
        right: 70,
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