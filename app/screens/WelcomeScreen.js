import React, { useEffect } from "react";
import { StyleSheet, ImageBackground, Image, View, Text, Button } from "react-native";
import colors from "../config/colors";

function WelcomeScreen({ navigation }) {

  useEffect(()=>{
    openDrawerTimer();
  }, [])

  const openDrawerTimer = () => {
    setTimeout(() => {
      navigation.openDrawer();
    }, 2000);
  };

  return (
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
    </ImageBackground>
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
