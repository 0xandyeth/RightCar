import React, { useState, useEffect } from 'react';
import { Layout, Text, Button, Datepicker, NativeDateService, Input, Avatar } from '@ui-kitten/components';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { TouchableWithoutFeedback, ScrollView, TouchableHighlight } from 'react-native-gesture-handler';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import { Image, Alert, View, TouchableOpacity } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { dispatchFileState, FileTypeEnum, useDocumentState, Actions } from './DocumentState';
import { Formik } from 'formik';
import moment from 'moment';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../../../state';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginScreenProps } from '../../../types';
import UploadIconComponent from '../../../image/UploadIconComponent';
import CountryPicker, { getAllCountries, FlagType } from 'react-native-country-picker-modal'
import * as Progress from 'react-native-progress';
import { useFocusEffect } from '@react-navigation/native';

const DATE_FORMAT = 'MMM DD,YYYY'
const formatDateService = new NativeDateService('en', { format: DATE_FORMAT });

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
    const [fileToShow, setFileToShow] = useState<string | null>(null);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [currentCountryObj, setCurrentCountryObj] = useState<any>({});
    const [currentFileType, setCurrentFileType] = useState(FileTypeEnum.passport);
    const [dictionary] = useDocumentState("dictionary")
    const [profile] = useGlobalState('profile')
    const [uploadPercent, setUploadPercent] = useState(0);

    const [getFilesReq, sendFile] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST',
        onUploadProgress: (e) => {
            console.log(e)
            var percentCompleted = Math.round((e.loaded * 100) / e.total)
            console.log("percentCompleted", percentCompleted)
            setUploadPercent(percentCompleted);
        }
    }, { manual: true })

    const initialValues = {
        docNumber: route.params?.docNumber,
        fileCountry: '',
        expDate: moment(`${route.params.year}-${route.params.month}-${route.params.day}`, 'YYYY-MM-DD')
    }

    useEffect(() => {
        getAllCountries(FlagType.FLAT)
            .then(countries => {
                const found = countries.find(c => c.cca2.toLowerCase() == route.params?.docCountry)
                setCurrentCountryObj(found)
            })
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            if (route.params.fileType == FileTypeEnum.passport) {
                setFileToShow(`https://www.right-cars.com/uploads/pass/${profile?.passimage}`)
            }
            if (route.params.fileType == FileTypeEnum.driving_license) {
                setFileToShow(`https://www.right-cars.com/uploads/drlic/${profile?.drimage}`)
            }
            if (route.params.fileType == FileTypeEnum.selfi) {
                setFileToShow(`https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}`)
            }
            triggerChange(p => !p)
        }, [route.params])
    );


    useEffect(() => {
        if (route.params && route.params.fileType) {
            console.log('params', route.params.fileType)
            setCurrentFileType(route.params.fileType)
        } else {
            setCurrentFileType(FileTypeEnum.passport)
        }
    }, [route.params])

    const currenButtonState = () => {
        if (dictionary.get(currentFileType)?.file) {
            return { btnTxt: 'Save', disabled: false }
        }

        return { btnTxt: 'Save', canGoNext: false, disabled: true }

    }

    return (
        <Layout style={{ display: 'flex', flex: 1, padding: '3%' }}>
            <Formik
                initialValues={initialValues}
                enableReinitialize={true}
                onSubmit={values => {

                    const data = new FormData();

                    const file = dictionary.get(currentFileType)?.file;

                    const currentFile = dictionary.get(currentFileType)?.file
                    if (currentFile) {
                        if ("fileName" in currentFile) {
                            (file as DocumentPickerResponse).name = (currentFile as ImagePickerResponse).fileName || currentFileType;
                        }
                    }

                    data.append("module_name", "FILE_UPLOAD");
                    data.append("file", file);
                    console.log(currentFileType)
                    data.append("fileType", currentFileType);
                    console.log(values)
                    if (currentFileType != FileTypeEnum.selfi) {
                        data.append("expDate", values.expDate.format('YYYY-MM-DD'));
                        data.append("filecountry", currentCountryObj.cca2?.toLowerCase());
                        data.append("docNumber", values.docNumber);
                    }

                    sendFile({ data })
                        .then(r => {
                            if (route.params.fileType == FileTypeEnum.passport) {
                                setFileToShow(`https://www.right-cars.com/uploads/pass/${r.data?.passimage}`)
                            }
                            if (route.params.fileType == FileTypeEnum.driving_license) {
                                setFileToShow(`https://www.right-cars.com/uploads/drlic/${r.data?.drimage}`)
                            }
                            if (route.params.fileType == FileTypeEnum.selfi) {
                                setFileToShow(`https://www.right-cars.com/uploads/selfi/${r.data?.selfiurl}`)
                            }
                            dispatchGlobalState({ type: 'profile', state: r.data })
                            dispatchFileState({ type: Actions.RESET, state: {} })
                            triggerChange(p => !p)
                            setUploadPercent(0)
                        })
                        .catch(r => console.log(r))

                }}
            >
                {({ handleChange, setFieldValue, handleSubmit, values, errors, touched, setFieldTouched }) => {
                    console.log(fileToShow)

                    return (
                        <>
                            <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1 }}>
                                <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', zIndex: 2 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 24, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                                        {currentFileType}
                                    </Text>
                                </Layout>
                                {getFilesReq.loading && (
                                    <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Progress.Circle
                                            showsText={true}
                                            textStyle={{ color: "#41d5fb" }}
                                            color={"#41d5fb"}
                                            size={250}
                                            progress={uploadPercent / 100}
                                            indeterminate={uploadPercent == 0}
                                            formatText={() => {
                                                return `${uploadPercent}%`
                                            }}
                                        />
                                    </View>
                                )}
                                {!getFilesReq.loading && !route.params.fileToShow && !dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <UploadIconComponent />
                                    <Text style={{ color: 'black', textAlign: 'left', fontSize: 16, fontFamily: 'SF-UI-Display' }} category='s2'>
                                        We need you to upload your
                                    </Text>
                                    <Text style={{ color: 'black', textAlign: 'left', fontSize: 26, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                                        {currentFileType}
                                    </Text>
                                </View>}

                                {fileToShow && !dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    {change ? (
                                        <Avatar
                                            key={fileToShow}
                                            style={{ width: 200, height: 200, resizeMode: 'cover', marginBottom: '3%', zIndex: -2 }}
                                            source={{ uri: fileToShow, cache: 'reload' }}
                                        />
                                    ) : (
                                            <Avatar
                                                key={fileToShow}
                                                style={{ width: 200, height: 200, resizeMode: 'cover', marginBottom: '3%', zIndex: -2 }}
                                                source={{ uri: fileToShow, cache: 'reload' }}
                                            />
                                        )}

                                </View>}

                                {dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <>
                                        <Avatar
                                            key={dictionary.get(currentFileType)?.file?.uri}
                                            style={{ width: 175, height: 175, resizeMode: 'cover', marginTop: '3%', marginBottom: '3%', zIndex: -2 }}
                                            source={{ uri: dictionary.get(currentFileType)?.file?.uri, cache: 'reload' }}
                                        />
                                        {currentFileType != FileTypeEnum.selfi && (
                                            <>
                                                <Datepicker
                                                    style={{ paddingLeft: '5%', paddingRight: '5%', marginBottom: '1%', width: '100%' }}
                                                    controlStyle={{
                                                        backgroundColor: 'white',
                                                        borderRadius: 10,
                                                        borderColor: errors.expDate && touched.expDate ? '#ffa5bc' : '#E4E9F2'
                                                    }}
                                                    placeholder={() => <Text style={{ padding: '1.5%', paddingLeft: '4%', color: errors.expDate && touched.expDate ? '#ffa5bc' : '#8F9BB3' }}>{errors.expDate && touched.expDate ? errors.expDate : 'Expire Date'}</Text>}
                                                    date={values?.expDate?.toDate()}
                                                    title={(d) => moment(d)?.format(DATE_FORMAT)}
                                                    dateService={formatDateService}
                                                    onSelect={nextDate => setFieldValue("expDate", moment(nextDate))}
                                                    accessoryRight={() => <EntypoIcon style={{ color: errors.expDate && touched.expDate ? '#ffa5bc' : '#8F9BB3', textAlign: 'left' }} name="calendar" size={22} />}
                                                />

                                                <Input
                                                    status={errors.docNumber && touched.docNumber ? 'danger' : undefined}
                                                    value={values.docNumber}
                                                    onChangeText={handleChange('docNumber')}
                                                    placeholderTextColor={errors.docNumber && touched.docNumber ? '#ffa5bc' : '#8F9BB3'}
                                                    style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '1%', width: "90%" }}
                                                    size="large"
                                                    onBlur={() => setFieldTouched('docNumber')}
                                                    placeholder={errors.docNumber && touched.docNumber ? errors.docNumber : 'Document Number'}
                                                />
                                                <Layout style={{ marginBottom: '1%', width: '90%' }}>
                                                    <TouchableOpacity onPress={() => setShowCountryModal(true)}>
                                                        <View style={{ width: '100%', borderWidth: 1, borderColor: errors.fileCountry && touched.fileCountry ? '#ffa5bc' : '#E4E9F2', borderRadius: 10 }}>
                                                            {errors.fileCountry && touched.fileCountry && !currentCountryObj && (
                                                                <Text style={{ color: '#ffa5bc', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                    {errors.fileCountry}
                                                                    asd
                                                                </Text>
                                                            )}
                                                            {!errors.fileCountry && currentCountryObj && currentCountryObj.name && (
                                                                <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                    {currentCountryObj.name.trim()}
                                                                </Text>
                                                            )}
                                                            {(!errors.fileCountry || !touched.fileCountry) && !currentCountryObj && (
                                                                <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                    Select Country
                                                                </Text>
                                                            )}
                                                        </View>
                                                    </TouchableOpacity>
                                                    {showCountryModal && (
                                                        <CountryPicker
                                                            containerButtonStyle={{
                                                                borderWidth: 1,
                                                                borderColor: errors.expDate && errors.expDate ? '#ffa5bc' : '#E4E9F2',
                                                                padding: '3%',
                                                                borderRadius: 10,
                                                                width: 350,
                                                            }}
                                                            countryCode={values.fileCountry?.cca2?.toUpperCase()}
                                                            visible={true}
                                                            withFilter={true}
                                                            withFlagButton={true}
                                                            withCountryNameButton={true}
                                                            renderFlagButton={() => {
                                                                return
                                                            }}
                                                            onClose={() => setTimeout(() => setShowCountryModal(false), 0)}
                                                            onSelect={(country) => {
                                                                setCurrentCountryObj(country)
                                                                setFieldValue('fileCountry', country)
                                                                setTimeout(() => setShowCountryModal(false), 0)
                                                            }}
                                                        />
                                                    )}
                                                </Layout>
                                            </>
                                        )}
                                    </>
                                </View>}

                                {!getFilesReq.loading && (
                                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: dictionary.get(currentFileType)?.file ? '-55%' : '-35%', justifyContent: 'center', alignItems: 'center' }}>
                                        <Button
                                            onPress={(e) => {
                                                ImagePicker.launchCamera(options, (response) => {
                                                    //console.log('Response = ', response);

                                                    if (response.didCancel) {
                                                        console.log('User cancelled image picker');
                                                    } else if (response.error) {
                                                        console.log('ImagePicker Error: ', response.error);
                                                    } else if (response.customButton) {
                                                        console.log('User tapped custom button: ', response.customButton);
                                                    } else {
                                                        dispatchFileState({ type: currentFileType, state: { file: response } })
                                                    }
                                                });
                                            }}
                                            style={{
                                                zIndex: 2,
                                                backgroundColor: '#41d5fb',
                                                borderColor: '#41d5fb',
                                                borderRadius: 30,
                                                width: '50%',
                                                marginLeft: 'auto',
                                                marginRight: 'auto'
                                            }}>
                                            {() => {
                                                return (
                                                    <>
                                                        <EntypoIcon style={{ marginRight: '5%', color: 'white' }} size={24} name="camera" />
                                                        <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>
                                                            Use Camera
                                                    </Text>
                                                    </>
                                                );
                                            }}
                                        </Button>
                                    </View>

                                )}

                                <TouchableWithoutFeedback
                                    style={{ backgroundColor: 'white', height: '55%', display: 'flex', justifyContent: 'center', alignItems: dictionary.get(currentFileType)?.file ? 'flex-end' : 'center', flexDirection: 'row' }}
                                    onPress={async () => {
                                        const res = await DocumentPicker.pick({
                                            type: [DocumentPicker.types.images],
                                        });
                                        dispatchFileState({ type: currentFileType, state: { file: res } })
                                    }}>

                                    <EntypoIcon style={{ marginRight: '5%', color: 'black' }} size={24} name="images" />
                                    <Text style={{ color: 'black', textAlign: 'left', fontSize: 16, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                                        Select the document from gallery
                                    </Text>

                                </TouchableWithoutFeedback>


                            </ScrollView>

                            <Layout style={{ paddingTop: '2%' }}>
                                <Button
                                    disabled={currenButtonState().disabled || getFilesReq.loading}
                                    onPress={() => {
                                        const currentState = currenButtonState()
                                        console.log(currentState)
                                        if (currentState.canGoNext) {
                                            navigation.navigate(currentState.goTo, currentState.with)
                                            return
                                        } else {
                                            handleSubmit()
                                        }
                                    }}
                                    size="giant"
                                    style={{
                                        backgroundColor: currenButtonState().disabled || getFilesReq.loading ? '#e4e9f2' : '#41d5fb',
                                        borderColor: currenButtonState().disabled || getFilesReq.loading ? '#e4e9f2' : '#41d5fb',
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
                                    {() => <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>
                                        {currenButtonState().btnTxt}
                                    </Text>}
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