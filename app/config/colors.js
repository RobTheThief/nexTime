var btTabColor;
var wifiTabColor;
 
var primary = "#004abb"; //original color #003380
var primaryLight = '#bac8de';
var secondary = "#cc6600";
var black = "#000";
var white = "#fff";
var light = "#f2f2f2";

const mode = {
  dark: {
    main: {
      backgroundColor: black,
    },
    appHeader: {
      backgroundColor: primary,
      borderBottomColor: primaryLight,
    },
    button: {
      backgroundColor: black,
    },
    buttonText: {
      color: primaryLight,
    },
    container: {
      borderColor: primaryLight,
      backgroundColor: black,
    },
    slider: white,
    tabBar: {
      backgroundColor: black,
    },
    drawerThemeStyles: {
      backgroundColor: black,
      color: secondary,
      fontColor: secondary,
      width: '50%'
    },
    startStopButton: {
      borderColor: primaryLight,
    },
    switchText: {
      color: primaryLight,
    },
    headers: {
      color: primaryLight,
    },
    radiTotal: {
      color: primaryLight
    },
    radiTextInput: {
      color: primaryLight
    },
    measureText: {
      color: primaryLight,
    },
    setRadiousContainer: {
      backgroundColor: black,
    },
    notes: {
      backgroundColor: black,
    },
    elevation: {
      elevation: 15,
      shadowColor: white,
    },
  },


  light :{
    main: {
      backgroundColor: light,
    },
    appHeader: {
      backgroundColor: primary,
      borderBottomColor: black,
    },
    buttonText: {
      color: primary,
    },
    button: {
      backgroundColor: light,
    },
    container: {
      borderColor: primaryLight,
      backgroundColor: light,
    },
    slider: black,
    tabBar: {
      backgroundColor: light,
    },
    drawerThemeStyles: {
      width: '50%',
      backgroundColor: light,
    },
    startStopButton: {
      borderColor: black,
    },
    switchText: {
      color: primary,
    },
    headers: {
      color: primary,
    },
    radiTotal: {
      color: primary,
    },
    radiTextInput: {
      color: primary,
    },
    measureText: {
      color: primary,
    },
    setRadiousContainer: {
      backgroundColor: light,
    },
    notes: {
      backgroundColor: light,
    },
    elevation: {
      elevation: 3,
      shadowColor: primary,
    },
  }  
};

export default {
  circle: "rgba(51,51,225, 0.5)",

  primary,
  primaryLight,
  secondary,
  black,
  white,
  light,

  btTabColor,
  wifiTabColor,
  mode,
};

