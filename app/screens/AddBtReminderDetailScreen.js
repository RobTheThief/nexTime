import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import appTasks from '../utility/appTasks';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import colors from '../config/colors';
import storage from '../utility/storage';

function AddBtReminderDetailScreen({
    addBtReminderDetailVisibility,
    pickedId,
    pickedTitle,
    updateReminderList,
    btRemindersArray,
    themeState }) {

    var index = -1;
    if(btRemindersArray !== null){
        index = btRemindersArray.findIndex((BTDevice) => pickedId === BTDevice.id);
    } 
    var reminder = undefined;
    if (index !== -1 && index !== null) {
        reminder = btRemindersArray[index];
    }

    const setNotesInputValue = () => 
        (reminder !== undefined && reminder !== null && reminder !== '') && reminder.notes
        ? reminder.notes
        : undefined;

    const [notes, setNotes] = useState(setNotesInputValue());

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
    
    useEffect(() => {     
        setNotes(setNotesInputValue);
    }, []);  

    const remindBT = async (id, title) => {
        if (btRemindersArray){
            index = btRemindersArray.findIndex((BTDevice) => pickedId === BTDevice.id);
        } else !index && (index = -1);

        index > -1 && btRemindersArray.splice(index, 1);
        !btRemindersArray && (btRemindersArray = []);
        btRemindersArray.push({ 
                                id: id,
                                name: title,
                                notes: notes,
                                taskDeleted: false,
                                repeat: repeatReminder,
                                delete: deleteOnTrig,
                                junk: false,
                                timeStamp: Date.now(),
                            });
        await storage.store("asyncSerialBTDevices", btRemindersArray);
        updateReminderList();
        Alert.alert('nexTime', `Reminder ${title} set.\n\nLocation service must be enabled for reminders to work.`);
        addBtReminderDetailVisibility();
        appTasks.isServiceRunning();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
            enabled={Platform.OS === "ios" ? true : false}
        >
            <View style={[styles.inputBox, colors.mode[themeState].main]} >
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
                    <TouchableOpacity style={[styles.buttons, colors.mode[themeState].button, colors.mode[themeState].elevation, {paddingLeft: 10}]} onPress={() => addBtReminderDetailVisibility() }>
                        <AntDesign name="leftcircle" color={colors.primary} size={29} />
                        <AppText style={[styles.buttonText, colors.mode[themeState].buttonText]}>Go Back</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.buttons, colors.mode[themeState].button, colors.mode[themeState].elevation]} onPress={() => remindBT(pickedId, pickedTitle) }>
                        <AntDesign name="enter" color={colors.primary} size={29} />
                        <AppText style={[styles.buttonText, colors.mode[themeState].buttonText] } >Set Reminder</AppText>
                    </TouchableOpacity>
                </View>
            </View>
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    buttons: {
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
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
    inputText: {
        width: "90%",
        height: "10%",
        alignItems: "center",
        marginVertical: 15,
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
        fontSize: 17,
    },
})

export default AddBtReminderDetailScreen;