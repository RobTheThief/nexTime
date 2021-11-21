import { AntDesign } from "@expo/vector-icons";
import { Alert, KeyboardAvoidingView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import appTasks from "../utility/appTasks";
import AppText from "../components/AppText";
import AppTextInput from "../components/AppTextInput";
import colors from "../config/colors";
import storage from "../utility/storage";

function AddWifiReminderDetailScreen({
    addWifiReminderDetailVisibility,
    pickedTitle,
    pickedId,
    updateReminderList,
    wifiRemindersArray,
    themeState }) {

    const setNotesInputValue = () => 
        (reminder !== undefined && reminder !== null && reminder !== '') && reminder.notes
        ? reminder.notes
        : undefined;

    const [notes, setNotes] = useState(setNotesInputValue());

    var index = -1;
    if(wifiRemindersArray !== null){
        index = wifiRemindersArray.findIndex((network) => pickedId === network.id);
    } 
    var reminder = undefined;
    if (index !== -1 && index !== null) {
        reminder = wifiRemindersArray[index];
    }

    const [repeatReminder, setRepeatReminder] = useState(
        reminder == undefined ? false : reminder.repeat
      );
    const toggleRepeat = () => {
        setRepeatReminder((previousState) => !previousState);
        if (deleteOnTrig === true) toggleDelete();
    };

    const [deleteOnTrig, setDeleteOnTrig] = useState(
        reminder == undefined ? false : reminder.delete
    );
    const toggleDelete = () => setDeleteOnTrig((previousState) => !previousState);

    const remindWifi = async (id, title) => {
        if (wifiRemindersArray){
            index = wifiRemindersArray.findIndex((network) => pickedId === network.id);
        } else !index && (index = -1);

        index > -1 && wifiRemindersArray.splice(index, 1);
        !wifiRemindersArray && (wifiRemindersArray = []);
        wifiRemindersArray.push({ 
                                id: id,
                                name: title,
                                notes: notes,
                                taskDeleted: false,
                                repeat: repeatReminder,
                                delete: deleteOnTrig,
                                junk: false,
                                timeStamp: Date.now(),
                            });
        await storage.store("asyncWifiReminders", wifiRemindersArray);
        updateReminderList();
        Alert.alert('nexTime', `Reminder ${title} set.\n\nLocation service must be enabled for reminders to work.`);
        addWifiReminderDetailVisibility();
        appTasks.isServiceRunning();
    };

    useEffect(() => {     
        setNotes(setNotesInputValue);
    }, []); 

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
            enabled={Platform.OS === "ios" ? true : false}
        >
            <View style={[styles.inputBox , colors.mode[themeState].main]} >
                <View style={styles.title}>
                    <AppText style={styles.titleLable} >Device:</AppText>
                    <AppText style={styles.titleDevice} >{pickedTitle}</AppText>
                </View>
                <AppTextInput
                    placeholder={"Notes eg. Shopping list..."}
                    multiline={true}
                    textAlignVertical={"top"}
                    spellCheck={true}
                    style={[styles.notes, colors.mode[themeState].container, colors.mode[themeState].elevation]}
                    onChangeText={(text) => setNotes(text)}
                    defaultValue={setNotesInputValue()}
                />
                <View style={styles.switchBox}>
                    <View style={styles.switchContainer}>
                        <AppText style={[styles.switchText, colors.mode[themeState].switchText]}>Repeat</AppText>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={repeatReminder ? colors.primary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleRepeat}
                            value={repeatReminder}
                        />
                    </View>
                    <View style={styles.switchContainer}>
                        <AppText style={[styles.switchText, colors.mode[themeState].switchText]}>Delete on Trigger</AppText>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={deleteOnTrig ? colors.primary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleDelete}
                            value={deleteOnTrig}
                            disabled={repeatReminder}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                        <TouchableOpacity style={[styles.button, colors.mode[themeState].button, colors.mode[themeState].elevation, {paddingLeft: 10}]} onPress={() => addWifiReminderDetailVisibility() }>
                            <AntDesign name="leftcircle" color={colors.primary} size={29} />
                            <AppText style={[styles.buttonText, colors.mode[themeState].buttonText]}>Go Back</AppText>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, colors.mode[themeState].button, colors.mode[themeState].elevation]} onPress={() => remindWifi(pickedId, pickedTitle) }>
                            <AntDesign name="enter" color={colors.primary} size={29} />
                            <AppText style={[styles.buttonText, colors.mode[themeState].buttonText]} >Set Reminder</AppText>
                        </TouchableOpacity>
                    </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        height: '150%',
        width: '40%',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primaryLight,
    },
    buttonContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 70,
        width: '100%',
    },
    buttonText: {
        marginLeft: 5,
        fontSize: 15,
    },
    inputBox: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: colors.light,
        padding: 15,
    },
    notes: {
        borderColor: colors.primaryLight,
        height: '40%',
        paddingLeft: 10,
        paddingTop: 10,
        borderWidth: 1,
        borderRadius: 25,
    },
    switchBox: {
        width: "100%",
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: 'flex-start',
        marginTop: 15,
    },
    switchContainer: {
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        marginBottom: 10,
    },
    switch: {
        position: "relative",
        top: 2,
    },
    switchText: {
        marginRight: 10,
        fontSize: 17,
    },
    title: {
        width: '100%',
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleLable: {
        marginRight: 10,
        color: colors.primary,
        fontSize: 17,
    },
    titleDevice: {
        color: colors.secondary,
        fontSize: 17,
    },
})

export default AddWifiReminderDetailScreen;