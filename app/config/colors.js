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

