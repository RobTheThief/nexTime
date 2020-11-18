import storage from './storage';

const arraysEqual = (a, b) => {
    if (a == null || b == null) return 'nothing to compare';
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; ++i) {
      if (a[i].timeStamp != b[i].timeStamp) return false;
    }
    return true;
  }

const loadReminderInterval = ( asyncIndex, lastAsyncReminder, setReminder) => {
  setInterval(async function() {
    const asyncReminders = await storage.get(asyncIndex);
    const compareResult = arraysEqual(asyncReminders, lastAsyncReminder);
    if(!compareResult || (compareResult === 'nothing to compare' && lastAsyncReminder !== null)) {
      setReminder(asyncReminders);
    }
    lastAsyncReminder = JSON.parse(JSON.stringify(asyncReminders));
  }, 3000);
}

  export default {
    arraysEqual,
    loadReminderInterval
  }