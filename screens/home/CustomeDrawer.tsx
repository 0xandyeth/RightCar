import React, { useEffect } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
} from "react-native";

import { Layout, Avatar, Text, Divider, Button, Modal, Card } from "@ui-kitten/components";
import { LoginScreenProps } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import { useGlobalState, dispatchGlobalState } from "../../state";
import userHasFullProfile from "../../utils/userHasFullProfile";
import userHasAllFiles from "../../utils/userHasAllFiles";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const menuData = [
    { name: "Privacy Policy", screenName: "Policy", iconName: 'shield',key: 'swwe' },
    { name: "Terms and Conditions", screenName: "TermsConditions", iconName: 'file-document',key: 'sdsfwwe' },
    { name: "Help", screenName: "MyBookings",iconName: 'help',key: 'qwrfwwe' },
    { name: "Logout", iconName: 'logout', key: 'assdrw', onPress: () => {
        Alert.alert(
            "Are you sure you want to logout?",
            "You will be send the Sign in",
            [
                {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Yes", onPress: () => dispatchGlobalState({ type: 'logout' }) }
            ],
            { cancelable: false }
        );
    } },
];

const DrawerMenu = ({ navigation }: { navigation: any }) => {
    const [profile] = useGlobalState('profile')

    const hasFullProfile = userHasFullProfile(profile || {})
    const hasAllFiles = userHasAllFiles(profile || {})

    const wasDrawerOpen = useIsDrawerOpen();

    useEffect(() => {
        if (hasFullProfile && hasAllFiles) {
            const found = menuData.find(i => i.key == "asd")
            if (!found) menuData.unshift({ name: "My Trips", screenName: "MyBookings", iconName: "car-side",iconSize: 30,key: 'asd' });
        }
    }, [wasDrawerOpen])

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
                    <Layout style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'relative', borderBottomWidth: 1, borderBottomColor: 'grey', paddingBottom: '8%' }}>
                        {profile?.selfiurl == "" && (
                            <Avatar
                                style={{ width: 125, height: 125, }}
                                source={require('../../image/rightcars.png')}
                            />
                        )}
                        {profile?.selfiurl != "" && (
                            <Avatar
                                style={{ width: 125, height: 125, }}
                                source={{ uri: `https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}` }}
                            />
                        )}
                    </Layout>
                </TouchableOpacity>

                <FlatList
                    style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                    data={menuData}
                    renderItem={({ item }) => (
                        // @ts-ignore
                        <DrawerItem
                            iconName={item.iconName}
                            navigation={navigation}
                            onPress={item.onPress}
                            iconSize={item.iconSize}
                            screenName={item.screenName as keyof LoginScreenProps}
                            name={item.name}
                            key={item.key}
                        />
                    )}
                />
            </View>
        </>
    );
}

const DrawerItem = ({ navigation, name, iconName,screenName,iconSize,onPress }: StackScreenProps<LoginScreenProps> & { name: string, iconSize: number,iconName: string,onPress?:() => void,screenName?: keyof LoginScreenProps }) => {
    return (
        <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
                if (screenName) {
                    navigation.navigate(screenName)
                } else {
                    onPress && onPress();
                }
            }}
        >
            <MaterialCommunityIcon style={{ marginLeft: '8%',marginRight: '4%', color: '#41d5fb', fontSize: iconSize || 25}} name={iconName} />
            <Text style={styles.menuItemText}>{name}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.43)",
        paddingTop: '10%',
        display: 'flex',
        justifyContent: 'center'
    },
    menuItem: {
        flexDirection: "row",
        alignItems: 'center',
        paddingTop: '3%',
        paddingBottom: '3%',
        borderBottomColor: 'gray',
        borderBottomWidth: 0.6,
    },
    menuItemText: {
        fontSize: 18,
        fontWeight: "300",
        color: "rgba(0,0,0,0.8)"
    },
});

export default DrawerMenu;