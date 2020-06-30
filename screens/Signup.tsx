
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Toggle } from '@ui-kitten/components';
import { TouchableWithoutFeedback, ImageProps, ScrollView, SafeAreaView } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RenderProp } from '@ui-kitten/components/devsupport';
import PhoneInputComponent from '../partials/PhoneInput';
import { TextInput } from 'react-native-gesture-handler';
import ReactNativePhoneInput from 'react-native-phone-input';
import ErrorLabel from '../partials/ErrorLabel';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import useAxios from 'axios-hooks'
import LoadingSpinner from '../partials/LoadingSpinner';
import { dispatchGlobalState } from '../state';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../partials/BackButton';
import FacebookButton from '../partials/FacebookButton';
import TwitterButton from '../partials/TwitterButton';
import { LoginManager, GraphRequest, GraphRequestManager } from "react-native-fbsdk";
import { handlePermissionPromt, handleUserData } from '../utils/FacebookAuth';
import { axiosInstance } from '../utils/AxiosBootstrap';


export default () => {
    const navigation = useNavigation();

    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [phonenumberToShow, setPhonenumberToShow] = useState<string>('');
    const [isoCountry, setIsoCountry] = useState<string>('us');
    const [asCompany, setAsCompany] = useState(false);
    const phoneInput = useRef<ReactNativePhoneInput<typeof TextInput> | null>(null);
    const [{ data, loading, error }, doRegister] = useAxios({
        url: `${GRCGDS_BACKEND}/user/register`,
        method: 'POST'
    }, { manual: true })

    const [loginReq, doLogin] = useAxios({
        url: `${GRCGDS_BACKEND}/user/login`,
        method: 'POST'
    }, { manual: true })


    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };

    const renderInputIcon: RenderProp<Partial<ImageProps>> = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon style={{ color: secureTextEntry ? '#e4e9f2' : 'black' }} name={secureTextEntry ? 'eye' : 'eye-slash'} size={30} />
        </TouchableWithoutFeedback>
    );

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView keyboardShouldPersistTaps={"handled"} >
                <Layout style={{ flex: 1, paddingLeft: '3%', paddingRight: '3%', paddingBottom: '3%' }}>
                    <Layout style={{ paddingBottom: '5%' }}>
                        <Layout style={{ flex: 1, paddingTop: '3%', paddingBottom: '2%', display: 'flex', flexDirection: 'row' }}>
                            <BackButton />
                            <Text style={{ textAlign: 'left', paddingLeft: '3%',fontSize: 25, marginBottom: '3%', fontFamily: 'SF-UI-Display_Bold' }} category='s2'>Create your account</Text>
                        </Layout>
                        <Layout style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={{ color: 'black' }}>Already have an account? </Text>
                            <Text onPress={() => navigation.navigate('Login')} style={{ color: '#41d5fb' }}>Log in</Text>
                        </Layout>
                    </Layout>

                    <Formik
                        initialValues={{
                            emailaddress: '',
                            password: '',
                            telecode: '',
                            tele: '',
                            countryCode: '',
                            confirmPassword: '',
                            company: '',
                            vat: ''
                        }}
                        validate={(values) => {
                            const errors: { emailaddress?: string, password?: string, tele?: string } = {};
                            if (!values.emailaddress) {
                                errors.emailaddress = 'Required';
                            }

                            if (!values.password) {
                                errors.password = 'Required';
                            }

                            if (!values.tele) {
                                errors.tele = 'Required';
                            }

                            return errors

                        }}
                        onSubmit={values => {

                            const data = values
                            data.username = values.emailaddress
                            data.module_name = "REGISTER"

                            doRegister({ data: { ...data, asCompany } })
                                .then((res) => {
                                    console.log(res.data)
                                    const data = {
                                        username: values.emailaddress,
                                        password: values.password,
                                        module_name: "LOGIN"
                                    }
                                    return doLogin({ data })
                                })
                                .then(res => {
                                    dispatchGlobalState({ type: 'token', state: res.data.token })
                                    dispatchGlobalState({ type: 'profile', state: res.data })
                                    navigation.navigate('Opt')
                                })

                        }}
                    >
                        {({ handleChange, touched, handleSubmit, values, errors, setFieldValue }) => {
                            return (
                                <>
                                    <Input
                                        status={errors.emailaddress && touched.emailaddress ? 'danger' : undefined}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Email</Text>}
                                        placeholder='Enter your email'
                                        value={values.emailaddress}
                                        onChangeText={handleChange('emailaddress')}
                                        caption={errors.emailaddress && touched.emailaddress ? () => <ErrorLabel text={errors.emailaddress} /> : undefined}
                                    />
                                    <Input
                                        status={errors.password && touched.password ? 'danger' : undefined}
                                        style={{ backgroundColor: '#ffffff', borderRadius: 10, marginBottom: '3%' }}
                                        size="large"
                                        label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Password</Text>}
                                        placeholder='Enter your password'
                                        secureTextEntry={secureTextEntry}
                                        accessoryRight={renderInputIcon}
                                        value={values.password}
                                        onChangeText={(e) => {
                                            handleChange('password')(e)
                                            handleChange('confirmPassword')(e)
                                        }}
                                        caption={errors.password && touched.password ? () => <ErrorLabel text={errors.password} /> : undefined}
                                    />

                                    <Layout style={{ marginBottom: '3%' }}>
                                        <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Phone number</Text>
                                        <PhoneInputComponent
                                            styles={{ borderColor: errors.tele && touched.tele ? '#ffa5bc' : '#e5eaf2', }}
                                            mobilecode={values.telecode}
                                            mobileNumber={phonenumberToShow}
                                            onCountryChanged={(countryCode) => {
                                                setFieldValue('countryCode', countryCode)
                                            }}
                                            onCodeChange={(code) => {
                                                setFieldValue('telecode', code)
                                            }}
                                            onNumberChange={(number) => {
                                                handleChange('tele')(number)
                                            }}
                                        />
                                        {errors.tele && touched.tele && <ErrorLabel text={errors.tele} />}
                                    </Layout>

                                    <Toggle checked={asCompany} onChange={() => setAsCompany(p => !p)}>
                                        Register as Company
                                    </Toggle>

                                    {asCompany && (
                                        <Layout>
                                            <Input
                                                status={errors.company && touched.company ? 'danger' : undefined}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10, marginTop: '3%', marginBottom: '3%' }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Company Name</Text>}
                                                placeholder='Enter your company name'
                                                value={values.company}
                                                onChangeText={handleChange('company')}
                                                caption={errors.company && touched.company ? () => <ErrorLabel text={errors.company} /> : undefined}
                                            />
                                            <Input
                                                status={errors.vat && touched.vat ? 'danger' : undefined}
                                                style={{ backgroundColor: '#ffffff', borderRadius: 10 }}
                                                size="large"
                                                label={() => <Text style={{ fontSize: 15, marginBottom: '2%' }} category='s2'>Company VAT Number</Text>}
                                                placeholder='Enter your company VAT number'
                                                value={values.vat}
                                                onChangeText={handleChange('vat')}
                                                caption={errors.vat && touched.vat ? () => <ErrorLabel text={errors.vat} /> : undefined}
                                            />
                                        </Layout>
                                    )}

                                    <Button
                                        disabled={loading == true || loginReq.loading == true}
                                        accessoryRight={loading ? LoadingSpinner : undefined}
                                        onPress={(e) => { handleSubmit() }}
                                        size="giant"
                                        style={{
                                            marginTop: '10%',
                                            backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                            borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
                                            marginBottom: '10%',
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
                                        {() => <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: loading ? "#ACB1C0" : 'white', fontSize: 18 }}>Sign up</Text>}
                                    </Button>
                                </>
                            );
                        }}
                    </Formik>

                    <Text style={{ textAlign: 'center', color: '#8f9bb5', marginBottom: '5%' }} category='s2'>Or sign up with social media</Text>

                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <FacebookButton onPress={() => {
                            LoginManager.logInWithPermissions(["public_profile", "email"])
                                .then(handlePermissionPromt)
                                .then(handleUserData)
                                .then(() => navigation.navigate('Home'))
                                .catch((error) => console.log("Login fail with error: " + error))
                        }} />

                        <TwitterButton onPress={() => {
                            axiosInstance({
                                method: "POST",
                                url: GRCGDS_BACKEND,
                                data: { module_name: "LOGIN_WITH_TWITTER" }
                            })
                                .then(res => {
                                    navigation.navigate('TwitterLogin', res.data)
                                })
                                .catch(err => console.log(err))

                        }} />
                    </Layout>

                    <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: '5%', flexWrap: 'wrap' }}>
                        <Text style={{ color: 'black' }}>By clicking "Sign Up" you agree to our</Text>
                        <Text style={{ color: '#41d5fb' }}>terms and conditions </Text>
                        <Text style={{ color: 'black' }}>as well as our </Text>
                        <Text style={{ color: '#41d5fb' }}>privacy policy</Text>
                    </Layout>
                </Layout>
            </ScrollView>
        </SafeAreaView>
    )
};
