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
      backgroundColor: primary
    },
    buttonText: {
      color: secondary,
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
    }, 
    switchText: {
      color: secondary,
    }
  },


  light :{
    main: {
      
    },
    appHeader: {
      backgroundColor: primary
    },
    buttonText: {
      color: primary,
    },
    container: {
      
    },
    slider: black,
    tabBar: {
     
    },
    drawerThemeStyles: {
      width: '50%'
    }, 
    switchText: {
      color: primary,
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

