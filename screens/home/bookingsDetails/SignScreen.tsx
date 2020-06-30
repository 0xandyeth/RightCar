import React, { useEffect, useState, useRef } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import Orientation from 'react-native-orientation-locker';
import SignatureCapture from 'react-native-signature-capture';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { useGlobalState } from '../../../state';


const DocumentScreen = ({ navigation }) => {
    const signRef = useRef<TextInput | null>(null);
    const route = useRoute();
    const [isClean, setIsClean] = useState(true);
    const [profile] = useGlobalState('profile');

    useFocusEffect(
        React.useCallback(() => {
            Orientation.lockToLandscape();
            return () => {
                Orientation.unlockAllOrientations()
                signRef.current?.resetImage();
                setIsClean(true)
            }
        }, [])
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={[{ flex: 1 }]}>
                <SignatureCapture
                    ref={ref => {
                        signRef.current = ref;
                    }}
                    style={[{ flex: 1 }]}
                    showNativeButtons={false}
                    showTitleLabel={true}
                    showBorder={true}
                    onDragEvent={() => {
                        setIsClean(false);
                    }}
                    onSaveEvent={(res) => {
                        console.log(res)
                        navigation.navigate('CompletedReport', {
                            signImagePath: `data:image/png;base64,${res.encoded}`,
                            pictures: route.params.pictures
                        })
                    }}
                />
                {isClean && <View style={{ position: 'absolute', width: '100%',top: '50%' }}>
                    <Text style={{ fontSize: 48,textAlign: 'center', color: 'rgba(0,0,0,0.2)'}}>Please sign here</Text>
                </View>}
                <View style={{ position: 'absolute', top: '85%', left: '5%', zIndex: 4 }}>
                    <TouchableWithoutFeedback onPress={() => {
                        signRef.current?.resetImage();
                        setIsClean(true)
                    }}>
                        <View >
                            <MaterialCommunityIcons name="reload" size={50} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ marginLeft: '5%', fontSize: 18 }}>Signed by: {profile.firstname}{' '}{profile.lastname}</Text>
                <Button
                    onPress={() => {
                        signRef.current?.saveImage()
                    }}
                    style={{
                        backgroundColor: '#41d5fb',
                        borderColor: '#41d5fb',
                    }}>Confirm</Button>
            </View>
        </SafeAreaView>
    );
};

export default DocumentScreen