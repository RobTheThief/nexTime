import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import appTasks from '../utility/appTasks';
import AppText from '../components/AppText';
import AppTextInput from '../components/AppTextInput';
import colors from '../config/colors';
import storage from '../utility/storage';

function AddBtReminderDetailScreen({addBtReminderDetailVisibility, pickedId, pickedTitle, updateReminderList, btRemindersArray}) {

    const [notes, setNotes] = useState();
    
    const index = btRemindersArray.findIndex((BTDevice) => pickedId === BTDevice.id);
    const reminder = btRemindersArray[index];

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

      const [startBluetooth, setStartBluetooth] = useState(
        reminder == undefined ? false : reminder.delete
      );
      const toggleStartBluetooth = () => {
          !startBluetooth && alert('Allows the app to automatically enable bluetooth while scanning. Bluetooth is disabled again when finished to save power.')
          setStartBluetooth((previousState) => !previousState);
        }
    

    const setNotesInputValue = () => 
    reminder !== undefined && reminder.notes
        ? reminder.notes
        : undefined;

    useEffect(() => {     
        setNotes(setNotesInputValue);
    }, []);  

    const remindBT = async (id, title) => {
        appTasks.startCheckBluetooth(id);
        btRemindersArray[0].id === '123456789' && btRemindersArray.splice(0, 2);
        index > -1 && btRemindersArray.splice(index, 1);
        btRemindersArray.push({ 
                                id: id,
                                name: title,
                                notes: notes,
                                taskDeleted: false,
                                repeat: repeatReminder,
                                delete: deleteOnTrig,
                                startBluetooth: startBluetooth,
                            });
        await storage.store("asyncSerialBTDevices", btRemindersArray);
        updateReminderList();
        alert(`Reminder ${title} set`);
        addBtReminderDetailVisibility();
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
            enabled={Platform.OS === "ios" ? true : false}
        >
            <View style={styles.inputBox} >
                <View style={styles.title}>
                    <AppText style={styles.titleLable} >DEVICE:</AppText>
                    <AppText style={styles.titleDevice} >{pickedTitle}</AppText>
                </View>
                <AppTextInput
                    placeholder={"Notes eg. Shopping list..."}
                    multiline={true}
                    textAlignVertical={"top"}
                    spellCheck={true}
                    style={styles.notes}
                    onChangeText={(text) => setNotes(text)}
                    defaultValue={setNotesInputValue()}
                />
                <View style={styles.switchBox}>
                    <View style={styles.switchContainer}>
                        <AppText style={styles.switchText}>REPEAT</AppText>
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
                        <AppText style={styles.switchText}>DELETE ON TRIGGER</AppText>
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
                    <View style={styles.switchContainer}>
                        <AppText style={styles.switchText}>START BLUETOOTH</AppText>
                        <Switch
                            style={styles.switch}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={startBluetooth ? colors.primary : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleStartBluetooth}
                            value={startBluetooth}
                        />
                    </View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.buttons} onPress={() => addBtReminderDetailVisibility() }>
                        <AntDesign name="leftcircle" color={colors.primary} size={29} />
                        <AppText style={styles.buttonText}>GO BACK</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttons} onPress={() => remindBT(pickedId, pickedTitle) }>
                        <AntDesign name="enter" color={colors.primary} size={29} />
                        <AppText style={styles.buttonText} >SET REMINDER</AppText>
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
        alignItems: 'center'
    },
    buttonContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 70,
        width: '100%',
    },
    buttonText: {
        marginLeft: 5,
    },
    inputBox: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: colors.light,
        padding: 10,
    },
    inputText: {
        width: "90%",
        height: "10%",
        alignItems: "center",
        marginVertical: 15,
    },
    notes: {
        borderColor: colors.primaryLight,
        borderBottomColor: colors.primaryLight,
        borderWidth: 2,
        height: 200,
        paddingLeft: 5,
        paddingTop: 5,
        borderWidth: 1,
        borderBottomWidth: 1
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
        color: colors.primary,
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
    },
})

export default AddBtReminderDetailScreen;