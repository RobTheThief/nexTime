import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

const askPermissionsNotifications = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert(
      "You will need to enable location permissions to get current location and for the reminders to work."
    );
  }
  return true;
};

const sendNotificationImmediately = async (title, body) => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus == "granted") {
    const content = { title: title, body: body, };
    Notifications.scheduleNotificationAsync({ content, trigger: null });
  }
};

const scheduleNotification = async () => {
  let notificationId = Notifications.scheduleLocalNotificationAsync(
    {
      title: "I'm Scheduled",
      body: "Wow, I can show up even when app is closed",
    },
    {
      repeat: "minute",
      time: new Date().getTime() + 10000,
    }
  );
  console.log(notificationId);
};

export {
  askPermissionsNotifications,
  sendNotificationImmediately,
  scheduleNotification,
};
