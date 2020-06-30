import React, { useState, useEffect } from 'react';
import { Layout, Text, Input, Button, Datepicker, NativeDateService } from '@ui-kitten/components';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import ImagePicker from 'react-native-image-picker';
import { Image, Alert, SafeAreaView, View } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import BackButton from '../../../partials/BackButton';
import { dispatchFileState, FileTypeEnum, useDocumentState, Actions } from './DocumentState';
import { Formik } from 'formik';
import moment from 'moment';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../../../state';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginScreenProps } from '../../../types';

const DATE_FORMAT = 'MMM DD,YYYY'
const formatDateService = new NativeDateService('en', { format: DATE_FORMAT });

type ParamList = {
    DocumentMetadata: {
        fileType: FileTypeEnum,
        metadata: boolean,
        year: string,
        month: string,
        day: string,
        image: string
    }
}

const options = {
    title: 'Select picture',
    chooseFromLibraryButtonTitle: '',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};


type Props = StackScreenProps<LoginScreenProps, 'SingleUpload'>;

const DocumentScreen = ({ route, navigation }: Props) => {
    const [change, triggerChange] = useState(true);
    const [dictionary] = useDocumentState("dictionary")
    const [profile] = useGlobalState('profile')

    let currentFileType = FileTypeEnum.passport
    if (!profile?.passimage) currentFileType = FileTypeEnum.passport
    if (!profile?.drimage) currentFileType = FileTypeEnum.driving_license
    if (!profile?.selfiurl) currentFileType = FileTypeEnum.selfi
    if (route.params && route.params.fileType) currentFileType = route.params.fileType

    const [getFilesReq, sendFile] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST',
    })

    const initialValues = {
        country: '',
        expDate: moment()
    }

    useEffect(() => {
        dispatchFileState({ type: Actions.RESET, state: {}})
    }, [])


    return (
        <Layout style={{ display: 'flex', flex: 1, padding: '3%' }}>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={values => {}}
            >
                {({ handleChange, setFieldValue, handleSubmit, values, errors, touched }) => {

                    return (
                        <>
                            <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1 }}>
                                <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ color: 'black', textAlign: 'center', fontSize: 26, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                                        Thanks! Your providing all your details, we are currently reviewing your information and shall let you know once they are approved
                                    </Text>
                                </View>
                            </ScrollView>

                            <Layout style={{ paddingTop: '2%' }}>
                                <Button
                                    onPress={() => {
                                        navigation.navigate('MyBookings');
                                    }}
                                    size="giant"
                                    style={{
                                        backgroundColor: '#41d5fb',
                                        borderColor: '#41d5fb',
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
                                    {() => <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>Ok</Text>}
                                </Button>
                            </Layout>
                        </>
                    )
                }}
            </Formik>
        </Layout>
    )
};

export default DocumentScreen