import DrawerNavigator from "../navigation/DrawerNavigator";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet, ImageBackground, Image, View, Text, Button } from "react-native";

import colors from "../config/colors";
import nexTheme from "../config/drawerTheme";

function WelcomeScreen({ themeState, setThemeState, numSystem, setNumSystem , welcome}) {

  return (
    <>
      {welcome ? (
          <ImageBackground
            source={require("../assets/background.jpg")}
            style={styles.background}
          >
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/nexTimeLogo.png")}
                style={styles.logo}
              />
              <Text style={styles.tagline}>Next time you're there</Text>
            </View>
          </ImageBackground>) 
          : ( <NavigationContainer theme={nexTheme} independent={true} >
                <DrawerNavigator  setThemeState={setThemeState}
                                  themeState={themeState}
                                  setNumSystem={setNumSystem} 
                                  numSystem={numSystem} />
              </NavigationContainer>)
        }
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    height: 60,
    width: 350,
  },
  logoContainer: {
    position: "absolute",
    top: 190,
    alignItems: "center",
  },
  tagline: {
    fontSize: 25,
    color: colors.black,
  },
});

export default WelcomeScreen;
