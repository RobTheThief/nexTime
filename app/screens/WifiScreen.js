import React from "react";
import { StyleSheet, View } from "react-native";
import AppHeader from "../components/AppHeader";

function WifiScreen({navigation}) {
  return (
    <>
      <AppHeader style={{height: '11.5%'}} navigation={ navigation } />
       <View style={styles.container}>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default WifiScreen;
