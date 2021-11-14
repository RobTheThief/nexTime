/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import * as Location from "expo-location";
import {name as appName} from './app.json';

import { sendNotificationImmediately } from './app/utility/notifications';
import storage from './app/utility/storage';


const checkPermissions = async () => {
    const {status} = await Location.getBackgroundPermissionsAsync();
    var reminded = await storage.get('permissionsReminded');
    if(!reminded) {
        await storage.store('permissionsReminded', {recent: true, firstStart: false});
        reminded = await storage.get('permissionsReminded');
    }

    if ( status === "granted" && reminded.firstStart === true) {
        reminded.recent = false; 
        await storage.store('permissionsReminded', reminded);
        return;
    }
    
    if (!reminded.recent) {
        sendNotificationImmediately("nexTime Permissions", "Open the app and renew permissions options.");
        reminded.recent = true; 
        await storage.store('permissionsReminded', reminded);
    } 
}

const checkGpsEnabled = async () => {
    if ( await Location.hasServicesEnabledAsync() ) {
        await storage.store('gpsReminded', false);
        return;
    }
    const reminded = await storage.get('gpsReminded');
    if (!reminded) {
        sendNotificationImmediately("nexTime Location", "Please enable GPS.");
        await storage.store('gpsReminded', true);
    } 
}

const MyHeadlessTask = async () => {
    checkPermissions();
    checkGpsEnabled();

    var storedTime = await storage.get('asyncTime');
    if (!storedTime) return;
    if (Date.now() - storedTime < 86400000) return; //Check background permissions every 24 hours
    await storage.store('asyncTime', Date.now());
    await storage.store('gpsReminded', false);
    await storage.store('permissionsReminded', {recent: false, firstStart: true});
    
};

AppRegistry.registerHeadlessTask('nexTimeService', () => MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
