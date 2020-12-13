import storage from './storage';

var screenFuncsAndVars = {
  asyncMarkers: {
    
  },
  asyncWifiReminders: {
    
  },
  asyncSerialBTDevices: {
    
  },
}

const resetRefreshObj = () => {
  screenFuncsAndVars = {
    asyncMarkers: {
      
    },
    asyncWifiReminders: {
      
    },
    asyncSerialBTDevices: {
      
    },
  }
}

const arraysEqual = (a, b) => {
  if (a == null || b == null) return 'nothing to compare';
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i].timeStamp != b[i].timeStamp) return false;
  }
  return true;
}

const refreshReminders = async (asyncIndex) => {
  if (screenFuncsAndVars[asyncIndex].setReminder !== undefined){
    const asyncReminders = await storage.get(asyncIndex);
    const compareResult = arraysEqual(asyncReminders, screenFuncsAndVars[asyncIndex].lastAsyncReminder);
    if(!compareResult || (compareResult === 'nothing to compare' && screenFuncsAndVars[asyncIndex].lastAsyncReminder !== null)) {
      screenFuncsAndVars[asyncIndex].setReminder(asyncReminders);
    }
    lastAsyncReminder = asyncReminders;
  }
}

const transferFuncAndVars = (screen, lastAsyncReminder, setReminder) => {
  if (screen === 'MapScreen'){
    screenFuncsAndVars.asyncMarkers = {
      lastAsyncReminder: lastAsyncReminder,
      setReminder: setReminder,
    }
  }
  if (screen === 'WifiScreen'){
    screenFuncsAndVars.asyncWifiReminders = {
      lastAsyncReminder: lastAsyncReminder,
      setReminder: setReminder,
    }
  }
  if (screen === 'BluetoothScreen'){
    screenFuncsAndVars.asyncSerialBTDevices = {
      lastAsyncReminder: lastAsyncReminder,
      setReminder: setReminder,
    }
  }
}


  export default {
    refreshReminders,
    resetRefreshObj,
    transferFuncAndVars,
  }