import * as Notifications from "expo-notifications";

const sendNotificationImmediately = async (title, body) => {
    const content = { title: title, body: body, };
    Notifications.scheduleNotificationAsync({ content, trigger: null });
};


export {
  sendNotificationImmediately,
};
