
import React, { useState, useEffect } from 'react'
import { Layout, Text, Input, Button, Datepicker, NativeDateService, Avatar, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, Image, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import useAxios from 'axios-hooks'
import { Formik } from 'formik';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { dispatchGlobalState, useGlobalState } from '../../state';
import { StackScreenProps } from '@react-navigation/stack';
import { NonLoginScreenProps, LoginScreenProps } from '../../types';
import LoadingSpinner from '../../partials/LoadingSpinner';
import ErrorLabel from '../../partials/ErrorLabel';
import PhoneInputComponent from '../../partials/PhoneInput';
import CountryPicker from 'react-native-country-picker-modal'
import userHasFullProfile from '../../utils/userHasFullProfile';
import userHasAllFiles from '../../utils/userHasAllFiles';
import { FileTypeEnum, useDocumentState, dispatchFileState } from './DocumentUpload/DocumentState';
import userIsCompany from '../../utils/userIsCompany';
import StepIndicator from 'react-native-step-indicator';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';
import UploadIconComponent from '../../image/UploadIconComponent';
import moment from 'moment';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { axiosInstance } from '../../utils/AxiosBootstrap';
import * as Progress from 'react-native-progress';

const options = {
    title: 'Select picture',
    chooseFromLibraryButtonTitle: '',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

const labels = ["Profile", "Passport", "Driving License", "Profile Picture", "Complete"];

const DATE_FORMAT = 'MMM DD,YYYY'
const formatDateService = new NativeDateService('en', { format: DATE_FORMAT });

export default ({ navigation }: StackScreenProps<NonLoginScreenProps & LoginScreenProps>) => {
    const [{ data, loading, error }, doLogin] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
    }, { manual: true })

    const [sendFileReq, sendFile] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST',
        onUploadProgress: (e) => {
            console.log(e)
            var percentCompleted = Math.round((e.loaded * 100) / e.total)
            console.log("percentCompleted", percentCompleted)
            setUploadPercent(percentCompleted);
        }
    }, { manual: true })

    const [uploadPercent, setUploadPercent] = useState(0);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [currentFileType, setCurrentFileType] = useState(FileTypeEnum.passport);
    const [dictionary] = useDocumentState("dictionary");
    const [profile] = useGlobalState('profile')
    const hasFullProfile = userHasFullProfile(profile || {})
    const hasAllFiles = userHasAllFiles(profile || {})
    const [asCompany, setAsCompany] = useState(false);

    useEffect(() => {
        if (hasAllFiles) {
            setCurrentPosition(4)
        }
        if (profile?.selfiurl == "") {
            setCurrentPosition(3)
            setCurrentFileType(FileTypeEnum.selfi)
        }

        if (profile?.drimage == "") {
            setCurrentPosition(2)
            setCurrentFileType(FileTypeEnum.driving_license)
        }
        if (profile?.passimage == "") {
            setCurrentPosition(1)
            setCurrentFileType(FileTypeEnum.passport)
        }

        if (!hasFullProfile) {
            setCurrentPosition(0)
        }

    }, [currentPosition])


    const resolveFormState = () => {
        if (currentPosition == 4) {
            return { btnTxt: 'Ok', disable: false, cb: () => navigation.navigate("MyBookings") }
        }
        if (currentPosition == 0 && hasFullProfile) {
            return { btnTxt: 'Next', disable: false }
        }

        if (currentPosition == 0 && !hasFullProfile) {
            return { btnTxt: 'Save & Next', disable: false }
        }

        if (currentPosition == 1 && dictionary.get(FileTypeEnum.passport)?.file) {
            return { btnTxt: 'Save & Next', disable: false }
        }

        if (currentPosition == 2 && dictionary.get(FileTypeEnum.driving_license)?.file) {
            return { btnTxt: 'Save & Next', disable: false }
        }

        if (currentPosition == 3 && dictionary.get(FileTypeEnum.selfi)?.file) {
            return { btnTxt: 'Save & Next', disable: false }
        }


        return { btnTxt: 'Save & Next', disable: true };
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', display: 'flex', padding: '3%' }}>
            <Formik
                initialValues={{
                    fileCountry: '',
                    docNumber: '',
                    expDate: null,

                    twoauth: false,
                    emailaddress: '',
                    mobilenumber: '',
                    firstname: '',
                    lastname: '',
                    mobilecode: '+1',
                    add1: '',
                    add2: '',
                    city: '',
                    postcode: '',
                    countryCode: profile?.country ? profile.country : '',
                    ...profile,
                    company: '',
                    vat: '',
                }}
                validate={(values) => {
                    const errors: { [k: string]: string } = {};
                    if (currentPosition == 0) {
                        if (!values.mobilenumber) errors.mobilenumber = 'Required';
                        if (!values.mobilecode) errors.mobilecode = 'Required';

                        if (userIsCompany(profile || {})) {
                            if (!values.company) errors.company = 'Required';
                            if (!values.vat) errors.vat = 'Required';
                        }
                    }

                    if (currentPosition == 1 && profile?.passimage == "" || currentPosition == 2 && profile?.drimage == "") {
                        if (!values.expDate) errors.expDate = 'Required';
                        if (!values.docNumber) errors.docNumber = 'Required';
                        if (!values.fileCountry) errors.fileCountry = 'Required';
                    }

                    return errors

                }}
                onSubmit={(values, { resetForm }) => {
                    if (currentPosition == 0 && !hasFullProfile) {
                        doLogin({ data: { ...values, module_name: "EDIT_PROFILE" } })
                            .then((res) => {
                                dispatchGlobalState({ type: 'token', state: res.data.token })
                                dispatchGlobalState({ type: 'profile', state: res.data })
                                setCurrentPosition(1)
                            })
                            .catch(err => console.log(err))
                        return
                    }

                    if ((currentPosition == 1 || currentPosition == 2 || currentPosition == 3) && dictionary.get(currentFileType)?.file) {
                        if (currentPosition == 1 && profile?.passimage != "") {
                            setCurrentPosition(2)
                            return
                        }
                        if (currentPosition == 2 && profile?.drimage != "") {
                            setCurrentPosition(3)
                            return
                        }
                        if (currentPosition == 3 && profile?.selfiurl != "") {
                            setCurrentPosition(4)
                            return
                        }
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
                        data.append("fileType", currentFileType);
                        if (values.expDate) {
                            data.append("expDate", values.expDate.format('YYYY-MM-DD'));
                        }
                        data.append("filecountry", values.fileCountry.cca2?.toLowerCase());
                        data.append("docNumber", values.docNumber);


                        sendFile({ data })
                            .then(r => {
                                console.log(r.data)
                                dispatchGlobalState({ type: 'profile', state: r.data })
                                setCurrentPosition(p => {
                                    resetForm({ touched: {} })
                                    console.log(`to step ${p + 1}`)
                                    return p + 1
                                })
                                setUploadPercent(0)
                            })
                            .catch(r => console.log(r))

                        return
                    }
                }}
            >
                {({ setFieldTouched, handleChange, setFieldValue, handleSubmit, values, errors, touched }) => {
                    return (
                        <>
                            <StepIndicator
                                currentPosition={currentPosition}
                                labels={labels}
                                customStyles={{
                                    stepStrokeCurrentColor: '#41d5fb',
                                    stepStrokeFinishedColor: '#41d5fb',
                                    stepStrokeUnFinishedColor: '#41d5fb',
                                    stepIndicatorUnFinishedColor: '#41d5fb',
                                    separatorFinishedColor: '#7eaec4',
                                    separatorUnFinishedColor: '#dedede',
                                    stepIndicatorFinishedColor: '#41d5fb',
                                    labelColor: '#999999',
                                    currentStepLabelColor: '#7eaec4',
                                }}
                            />
                            {currentPosition == 0 && (
                                <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1 }}>
                                    <Input
                                        status={errors.emailaddress && touched.emailaddress ? 'danger' : undefined}
                                        value={values.emailaddress}
                                        onChangeText={handleChange('emailaddress')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Email</Text>}
                                        placeholder='Enter your email'
                                        caption={errors.emailaddress && touched.emailaddress ? () => <ErrorLabel text={errors.emailaddress} /> : undefined}

                                    />

                                    <Layout style={{ marginBottom: '3%' }}>
                                        <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Phone number</Text>
                                        <PhoneInputComponent
                                            styles={{ borderColor: errors.mobilenumber && touched.mobilenumber ? '#ffa5bc' : '#e5eaf2', }}
                                            mobilecode={values.mobilecode}
                                            mobileNumber={values.mobilenumber}
                                            onCountryChanged={(countryCode) => {
                                            }}
                                            onCodeChange={(code) => {
                                                setFieldValue('mobilecode', code)
                                            }}
                                            onNumberChange={(number) => {
                                                handleChange('mobilenumber')(number)
                                            }}
                                        />
                                        {errors.mobilenumber && touched.mobilenumber && <ErrorLabel text={errors.mobilenumber} />}
                                    </Layout>

                                    <Toggle checked={values.twoauth} style={{ marginBottom: '0%' }} onChange={() => setFieldValue("twoauth", !values.twoauth)}>
                                        Enable 2-factor authentication
                                    </Toggle>

                                    <Layout style={{ marginBottom: '3%' }}>
                                        <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Country</Text>
                                        <CountryPicker
                                            containerButtonStyle={{ borderWidth: 1, borderColor: '#E4E9F2', padding: '2%', borderRadius: 10 }}
                                            countryCode={values.countryCode.toUpperCase()}
                                            withFilter={true}
                                            withFlagButton={true}
                                            withCountryNameButton={true}
                                            onSelect={(country) => {
                                                setFieldValue('countryCode', country.cca2.toLowerCase())
                                            }}
                                        />
                                    </Layout>

                                    <Input
                                        status={errors.firstname && touched.firstname ? 'danger' : undefined}
                                        value={values.firstname}
                                        onChangeText={handleChange('firstname')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>First Name</Text>}
                                        placeholder='Enter First Name'
                                        caption={errors.firstname && touched.firstname ? () => <ErrorLabel text={errors.firstname} /> : undefined}
                                    />

                                    <Input
                                        status={errors.lastname && touched.lastname ? 'danger' : undefined}
                                        value={values.lastname}
                                        onChangeText={handleChange('lastname')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Last Name</Text>}
                                        placeholder='Enter your last name'
                                        caption={errors.lastname && touched.lastname ? () => <ErrorLabel text={errors.lastname} /> : undefined}
                                    />

                                    <Input
                                        status={errors.add1 && touched.add1 ? 'danger' : undefined}
                                        value={values.add1}
                                        onChangeText={handleChange('add1')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Address 1</Text>}
                                        placeholder='Enter your address'
                                        caption={errors.add1 && touched.add1 ? () => <ErrorLabel text={errors.add1} /> : undefined}
                                    />

                                    <Input
                                        status={errors.add2 && touched.add2 ? 'danger' : undefined}
                                        value={values.add2}
                                        onChangeText={handleChange('add2')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Address 2</Text>}
                                        placeholder='Enter your address'
                                        caption={errors.add2 && touched.add2 ? () => <ErrorLabel text={errors.add2} /> : undefined}
                                    />

                                    <Input
                                        status={errors.city && touched.city ? 'danger' : undefined}
                                        value={values.city}
                                        onChangeText={handleChange('city')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>City</Text>}
                                        placeholder='Enter your address'
                                        caption={errors.city && touched.city ? () => <ErrorLabel text={errors.city} /> : undefined}
                                    />

                                    <Input
                                        status={errors.postcode && touched.postcode ? 'danger' : undefined}
                                        value={values.postcode}
                                        onChangeText={handleChange('postcode')}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Postcode</Text>}
                                        placeholder='Enter your address'
                                        caption={errors.postcode && touched.postcode ? () => <ErrorLabel text={errors.postcode} /> : undefined}
                                    />

                                    <Toggle checked={asCompany} style={{ marginBottom: '5%' }} onChange={() => setAsCompany(p => !p)}>
                                        Company Account
                                    </Toggle>

                                    {asCompany && (
                                        <>
                                            <Input
                                                status={errors.company && touched.company ? 'danger' : undefined}
                                                value={values.company}
                                                onChangeText={handleChange('company')}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Company Name</Text>}
                                                placeholder='Enter your Company Name'
                                                caption={errors.company && touched.company ? () => <ErrorLabel text={errors.company} /> : undefined}
                                            /><Input
                                                status={errors.vat && touched.vat ? 'danger' : undefined}
                                                value={values.vat}
                                                onChangeText={handleChange('vat')}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '5%' }} category='s2'>Company VAT Number</Text>}
                                                placeholder='Enter your Company VAT number'
                                                caption={errors.vat && touched.vat ? () => <ErrorLabel text={errors.vat} /> : undefined}
                                            />
                                        </>
                                    )}
                                </ScrollView>
                            )}

                            {currentPosition >= 4 && (
                                <View style={{ flexGrow: 1 }}>
                                    <Text style={{ textAlign: 'center', marginTop: '30%' }} category="h5">
                                        Thank You for completing your profile, we shall let you know once your documents are verified
                                    </Text>
                                </View>
                            )}

                            {(currentPosition == 1 || currentPosition == 2 || currentPosition == 3) && (
                                <ScrollView keyboardShouldPersistTaps={"handled"} contentContainerStyle={{ flexGrow: 1, backgroundColor: 'red' }}>
                                    {sendFileReq.loading && (
                                        <View style={{ backgroundColor: 'white', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Progress.Circle
                                                showsText={true}
                                                textStyle={{ color: "#41d5fb" }}
                                                color={"#41d5fb"}
                                                size={100}
                                                progress={uploadPercent / 100}
                                                indeterminate={uploadPercent == 0}
                                                formatText={() => {
                                                    return `${uploadPercent}%`
                                                }}
                                            />
                                        </View>
                                    )}

                                    {!sendFileReq.loading && !dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', height: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <UploadIconComponent />
                                        <Text style={{ color: 'black', textAlign: 'left', fontSize: 16, fontFamily: 'SF-UI-Display' }} category='s2'>
                                            We need you to upload your
                                            </Text>
                                        <Text style={{ color: 'black', textAlign: 'left', fontSize: 26, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                                            {currentFileType}
                                        </Text>
                                    </View>}

                                    {!sendFileReq.loading && dictionary.get(currentFileType)?.file && <View style={{ backgroundColor: 'white', height: '77%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <>
                                            <Avatar
                                                key={dictionary.get(currentFileType)?.file?.uri}
                                                style={{ width: 200, height: 200, resizeMode: 'cover', marginBottom: '3%', zIndex: -2 }}
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
                                                        min={new Date()}
                                                        max={moment().startOf('year').add(100, 'y').toDate()}
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
                                                                {errors.fileCountry && touched.fileCountry && (
                                                                    <Text style={{ color: '#ffa5bc', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                        {errors.fileCountry}
                                                                    </Text>
                                                                )}
                                                                {!errors.fileCountry && values.fileCountry.name && (
                                                                    <Text style={{ color: '#8F9BB3', padding: '3.5%', marginLeft: '3.5%' }}>
                                                                        {values.fileCountry.name}
                                                                    </Text>
                                                                )}
                                                                {(!errors.fileCountry || !touched.fileCountry) && !values.fileCountry.name && (
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
                                                                    console.log(country.flag)
                                                                    setFieldValue('fileCountry', country)
                                                                }}
                                                            />
                                                        )}
                                                    </Layout>
                                                </>
                                            )}
                                        </>
                                    </View>}

                                    {!sendFileReq.loading && (
                                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: dictionary.get(currentFileType)?.file ? '-65%' : '-20%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button
                                                onPress={(e) => {
                                                    try {
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
                                                    } catch (error) {
                                                        axiosInstance({
                                                            url: GRCGDS_BACKEND,
                                                            method: 'POST',
                                                            data: {
                                                                module_name: 'ERROR_TRACK',
                                                                errorMessage: `${error.message}\n${error.stack}`,
                                                            }
                                                        })
                                                    }
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

                                    {!sendFileReq.loading && (
                                        <TouchableWithoutFeedback onPress={async () => {
                                            try {
                                                const res = await DocumentPicker.pick({
                                                    type: [DocumentPicker.types.images],
                                                });
                                                dispatchFileState({ type: currentFileType, state: { file: res } })
                                            } catch (error) {
                                                axiosInstance({
                                                    url: GRCGDS_BACKEND,
                                                    method: 'POST',
                                                    data: {
                                                        module_name: 'ERROR_TRACK',
                                                        errorMessage: `${error.message}\n${error.stack}`,
                                                    }
                                                })
                                            }
                                        }}>
                                            <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: dictionary.get(currentFileType)?.file ? '23%' : '40%', alignItems: dictionary.get(currentFileType)?.file ? 'flex-end' : 'center' }}>

                                                <EntypoIcon style={{ marginRight: '5%', color: 'black', textAlign: 'center', }} size={24} name="images" />
                                                <Text style={{ color: 'black', textAlign: 'center', fontSize: 16, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                                                    Select the document from gallery
                                                        </Text>
                                            </Layout>

                                        </TouchableWithoutFeedback>
                                    )}

                                </ScrollView>
                            )}

                            <Button
                                accessoryRight={loading ? LoadingSpinner : undefined}
                                disabled={loading || sendFileReq.loading || resolveFormState().disable}
                                onPress={(e) => {
                                    handleSubmit()
                                    const cb = resolveFormState().cb
                                    cb && cb()
                                }}
                                size="giant"
                                style={{
                                    backgroundColor: resolveFormState().disable || loading || sendFileReq.loading ? '#e4e9f2' : '#41d5fb',
                                    borderColor: resolveFormState().disable || loading || sendFileReq.loading ? '#e4e9f2' : '#41d5fb',
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
                                {() => {
                                    return <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: loading ? "#ACB1C0" : 'white', fontSize: 18 }}>
                                        {resolveFormState().btnTxt}
                                    </Text>
                                }}
                            </Button>
                        </>
                    )
                }}
            </Formik>

        </SafeAreaView>
    )
};
