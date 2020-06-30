import React, { useEffect, useState, useRef } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import SignatureCapture from 'react-native-signature-capture';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../../../partials/BackButton';


const DocumentScreen = ({ navigation }) => {
    const signRef = useRef<TextInput | null>(null);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1}} >


            <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>


                <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '15%', marginBottom: '10%' }}>
                    <Text style={{ marginBottom: '10%', textAlign: 'center' }} category="h3">
                        Sign our agreement
          </Text>

                    <Text style={{ textAlign: 'center' }} category="h5">
                        Now sign our agreement and complete the report process
                </Text>
                </Layout>


                <Button
                    onPress={() => {
                        navigation.navigate('Sign');
                    }}
                    size="giant"
                    style={{
                        backgroundColor: '#41d5fb',
                        borderColor: '#41d5fb',
                        marginTop: '35%',
                        borderRadius: 10,
                        shadowColor: '#41d5fb',
                        shadowOffset: {
                            width: 0,
                            height: 10,
                        },
                        shadowOpacity: 0.51,
                        shadowRadius: 13.16,
                        elevation: 10,
                    }}>
                    {() => <Text style={{ color: 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>Sign agreement</Text>}
                </Button>

            </Layout>
            </ScrollView>
        </SafeAreaView>
    );
};

export default DocumentScreen