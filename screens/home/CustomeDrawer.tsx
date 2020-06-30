import React, { useEffect } from "react";
import {
    StyleSheet,
    TouchableOpacity,
    View,
    FlatList,
    Alert,
    Image
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
];

const DrawerMenu = ({ navigation }: { navigation: any }) => {
    const [profile] = useGlobalState('profile')

    const hasFullProfile = userHasFullProfile(profile || {})
    const hasAllFiles = userHasAllFiles(profile || {})

    const wasDrawerOpen = useIsDrawerOpen();

    useEffect(() => {
        if (hasFullProfile && hasAllFiles) {
            const found = menuData.find(i => i.key == "asd")
            if (!found) menuData.push({ name: "My Trips", screenName: "MyBookings", key: 'asd' },);
        }
    }, [wasDrawerOpen])

    return (
        <>
            <View style={styles.container}>
                <TouchableOpacity style={{ paddingBottom: '5%'}} onPress={() => navigation.navigate("EditProfile")}>
                    <Layout style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', position: 'relative' }}>
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
                    style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
                    data={menuData}
                    renderItem={({ item }) => (
                        // @ts-ignore
                        <DrawerItem
                            navigation={navigation}
                            screenName={item.screenName as keyof LoginScreenProps}
                            name={item.name}
                            key={item.key}
                        />
                    )}
                />
            </View>
            <Button onPress={() => {
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
            }} size="giant" style={{ borderRadius: 10, backgroundColor: '#cf1830', borderColor: '#cf1830', marginRight: '10%', marginLeft: '10%', marginBottom: '5%', marginTop: '5%' }}>
                {() => <Text style={{ color: 'white' }}>Logout</Text>}
            </Button>
        </>
    );
}

const DrawerItem = ({ navigation, name, screenName }: StackScreenProps<LoginScreenProps> & { name: string, screenName: keyof LoginScreenProps }) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={() =>
            navigation.navigate(screenName)
        }
    >
        <MaterialCommunityIcon style={{ marginRight: '2%', color: '#41d5fb'}} size={40} name="car-sports" />
        <Text style={styles.menuItemText}>{name}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.43)",
        paddingTop: '20%',
        display: 'flex',
        justifyContent: 'center'
    },
    menuItem: {
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: '15%',
        marginTop: '5%',
        marginLeft: '10%'
    },
    menuItemText: {
        fontSize: 20,
        fontWeight: "300",
        color: "white"
    },
});

export default DrawerMenu;