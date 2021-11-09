import { Alert } from "react-native";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import * as React from "react";
import * as TaskManager from "expo-task-manager";

import appTasks from "./app/utility/appTasks";
import colors from "./app/config/colors";
import refreshData from "./app/utility/refreshData";
import storage from './app/utility/storage';
import WelcomeScreen from "./app/screens/WelcomeScreen";


Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

TaskManager.defineTask('checkLocation', async ({ data: { locations }, error }) => {
  console.log('Tasks running !!!');

  var taskAsyncMarkers = await storage.get('asyncMarkers');
  if(taskAsyncMarkers[0] && taskAsyncMarkers[0].id){
    await appTasks.startCheckLocation(locations, taskAsyncMarkers);
    refreshData.refreshReminders('asyncMarkers');
  }
  
  var taskAsyncWifiNetworks = await storage.get("asyncWifiReminders");
  if(taskAsyncWifiNetworks && taskAsyncWifiNetworks[0].id){
    await appTasks.startCheckWifi( taskAsyncWifiNetworks );
    refreshData.refreshReminders('asyncWifiReminders');
  }
  
  var taskAsyncBTDevices = await storage.get("asyncSerialBTDevices");
  if(taskAsyncBTDevices && taskAsyncBTDevices[0].id){
    await appTasks.startCheckBluetoothAsync( taskAsyncBTDevices );
    refreshData.refreshReminders('asyncSerialBTDevices');
  }

  if (error){
    console.log(error);
    return;
  }
});

export default function App() {

  const foregroundPermissionsStatus = () => {
    return new Promise( async resolve => {
      const {status} = await Location.getForegroundPermissionsAsync();
      resolve(status);
    });
  }

  const backgroundPermissionsStatus = () => {
    return new Promise( async resolve => {
      const {status} = await Location.getBackgroundPermissionsAsync();
      resolve(status);
    });
  };

  
  const requestPermission = () => {
    return new Promise( async resolve => {

      await Location.requestForegroundPermissionsAsync();
      const foreResult = await foregroundPermissionsStatus().then( async(foregroundStatus) => {
        return foregroundStatus;
      });
      
      await Location.requestBackgroundPermissionsAsync();
      const backResult = await backgroundPermissionsStatus().then( async (backgroundStatus) => {
        return backgroundStatus;
      });
      
      resolve({foreResult: foreResult, backResult: backResult});
      });
  };

  const privacyPolicyMessage = async () => {
    const {status} = await Location.getForegroundPermissionsAsync();
    setTimeout(() => {
      if(status !== 'granted'){
        Alert.alert(
          "Privacy Policy",
          `RobTheThief built the nexTime app as a free app. This SERVICE is provided by RobTheThief and is intended for use as is.\nThis page is used to inform visitors regarding my policies with the collection, use, and disclosure of Personal Information if anyone decided to use my Service.\nIf you choose to use my Service, then you agree to the collection and use of information in relation to this policy. The Personal Information that I collect is used for providing and improving the Service. I will not use or share your information with anyone except as described in this Privacy Policy.\nThe terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at nexTime unless otherwise defined in this Privacy Policy.\nInformation Collection and Use\nFor a better experience, while using our Service, I may require you to provide us with certain personally identifiable information, including but not limited to Location data. The information that I request will be retained on your device and is not collected by me in any way.\nThe app does use third party services that may collect information used to identify you.\nThird party service providers used by the app\n\nGoogle Play Services\nExpo\nLog Data\n\nI want to inform you that whenever you use my Service, in a case of an error in the app I collect data and information (through third party products) on your phone called Log Data. This Log Data may include information such as your device Internet Protocol (“IP”) address, device name, operating system version, the configuration of the app when utilizing my Service, the time and date of your use of the Service, and other statistics.\n\nCookies\n\nCookies are files with a small amount of data that are commonly used as anonymous unique identifiers. These are sent to your browser from the websites that you visit and are stored on your device's internal memory.\n\nThis Service does not use these “cookies” explicitly. However, the app may use third party code and libraries that use “cookies” to collect information and improve their services. You have the option to either accept or refuse these cookies and know when a cookie is being sent to your device. If you choose to refuse our cookies, you may not be able to use some portions of this Service.\n\nService Providers\n\nI may employ third-party companies and individuals due to the following reasons:\n\nTo facilitate our Service;\nTo provide the Service on our behalf;\nTo perform Service-related services; or\nTo assist us in analyzing how our Service is used.\n\nI want to inform users of this Service that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.\n\nSecurity\n\nI value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and I cannot guarantee its absolute security.\n\nLinks to Other Sites\n\nThis Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by me. Therefore, I strongly advise you to review the Privacy Policy of these websites. I have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.\n\nChildren’s Privacy\n\nThese Services do not address anyone under the age of 13. I do not knowingly collect personally identifiable information from children under 13. In the case I discover that a child under 13 has provided me with personal information, I immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact me so that I will be able to do necessary actions.\n\nChanges to This Privacy Policy\n\nI may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. I will notify you of any changes by posting the new Privacy Policy on this page.\n\nThis policy is effective as of 2021-01-29\n\nContact Us\n\nIf you have any questions or suggestions about my Privacy Policy, do not hesitate to contact me at robthethief.dev@gmail.com or through the contact form on my website http://www.robgannon.com/contact.php\n\nThis privacy policy page was created at privacypolicytemplate.net and modified/generated by App Privacy Policy Generator`,
          [
            {
              text: "OK",
              onPress:  () => {
                backgroundLocationMessage();
                }
            },
            {
              text: "No thanks"
            }
          ],
          { cancelable: false }
        );
      }else {
        requestPermissionAndLoadOptions();
      }
    }, 2000);
  };

  const backgroundLocationMessage = async () => {
        Alert.alert(
          "      Backgroung Location",
          `    To use the map and reminders,\n    allow permissions for location\n\n          WHILE USING THE APP\n\n                           and\n\n                  ALL THE TIME.\n\nnextTime will use your location in the background to trigger reminders you have set.\n\nLocation information is only stored on your device and is never shared.`,
          [
            {
              text: "OK",
              onPress:  () => {
                requestPermissionAndLoadOptions();
                }
            },
            {
              text: "No thanks"
            }
          ],
          { cancelable: false }
        );
      };

  const [welcome, setWelcome] = React.useState(true);
  const [themeState, setThemeState] = React.useState();
  const [numSystem, setNumSystem] = React.useState();


  const loadOptionsToMemAndSetAsync = async () => {
    
    await stopService();
    await storage.formatStorage();
    await storage.firstPickNumSystem();
    setThemeState(storage.getOptions().color);
    colors.btTabColor = colors.secondary;
    colors.wifiTabColor = colors.primaryLight;
    setTimeout(async () => {
      setWelcome(false);
      appTasks.checkLocationTask();
    }, 2000);
  
  };

  const requestPermissionAndLoadOptions = async () => {
    const result = await requestPermission();
    (result.foreResult == 'granted' && result.backResult == 'granted') ?
    await loadOptionsToMemAndSetAsync() : alert("You will need to enable location permissions to get current location and for the reminders to work.");
  };

  const stopService = () => {
    return new Promise( async resolve => {
      var isRunning = await Location.hasStartedLocationUpdatesAsync('checkLocation');
      isRunning && await Location.stopLocationUpdatesAsync('checkLocation');
      resolve();
    });  
  };

  React.useEffect(() => {
    refreshData.resetRefreshObj();   
    privacyPolicyMessage();
  }, []);

  React.useLayoutEffect(() => {
    return async () => {
      await Location.stopLocationUpdatesAsync('checkLocation');
      appTasks.checkLocationTask();
    }
}, [])
  

  return (
    <WelcomeScreen  setThemeState={setThemeState}
                    themeState={themeState}
                    setNumSystem={setNumSystem} 
                    numSystem={numSystem}
                    welcome={welcome}
    />
  );
}
