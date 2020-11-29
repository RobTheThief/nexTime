import appTasks from './appTasks';
import storage from './storage';

const arraysEqual = (a, b) => {
  if (a == null || b == null) return 'nothing to compare';
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i].timeStamp != b[i].timeStamp) return false;
  }
  return true;
}

class Interval {
  constructor(fn, time) {
    var timer = false;
    this.start = function () {
      if (!this.isRunning())
        timer = setInterval(fn, time);
    };
    this.stop = function () {
      clearInterval(timer);
      timer = false;
    };
    this.isRunning = function () {
      return timer !== false;
    };
  }
}

const loadReminderIntervalAsync = ( asyncIndex, lastAsyncReminder, setReminder, intervalClass) => {

  const myIntervalFunc = async () => {
    
      if (appTasks.areTasksRunning() === false){
        const asyncReminders = await storage.get(asyncIndex);
        const compareResult = arraysEqual(asyncReminders, lastAsyncReminder);
        if(!compareResult || (compareResult === 'nothing to compare' && lastAsyncReminder !== null)) {
          setReminder(asyncReminders);
        }
        lastAsyncReminder = asyncReminders;
      }
    }

    if (intervalClass === undefined) {
      intervalClass = new Interval(myIntervalFunc, 3000);
    }

    if (intervalClass !== 'once is enough thanks' && intervalClass !== undefined) {
      if(!intervalClass.isRunning()){
        intervalClass.start();
      }
    }
  
}


  export default {
    loadReminderIntervalAsync,
  }