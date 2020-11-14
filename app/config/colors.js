var btTabColor;
var wifiTabColor;

var primary = "#003380";
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
      backgroundColor: primary
    },
    container: {
      borderBottomColor: primaryLight
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
    } 
  },


  light :{
    main: {
      
    },
    appHeader: {
      backgroundColor: primary
    },
    container: {
      
    },
    slider: black,
    tabBar: {
     
    },
    drawerThemeStyles: {
      width: '50%'
    } 
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

