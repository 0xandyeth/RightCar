import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../state';
import { axiosInstance } from '../utils/AxiosBootstrap';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../partials/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../partials/BackButton';
import { AppFontBold, AppFontRegular } from '../constants/fonts'

const DocumentScreen = () => {
  const [profile] = useGlobalState('profile');
  const navigation = useNavigation();

  const [{ data, loading, error }, doVerify] = useAxios({
    url: `${GRCGDS_BACKEND}`,
    method: 'POST'
  }, { manual: true })

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center' }}>
          <BackButton />

          <Text style={{ marginLeft: '2%', textAlign: 'left' }} category="h3">Login</Text>
        </Layout>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '15%', marginBottom: '10%' }}>
          <Text style={{ marginBottom: '10%', textAlign: 'center' }} category="h3">
            Verify Your Email
          </Text>

          <Text style={{ textAlign: 'center' }} category="h5">
            To access the app we need your to verify your email.
            Please login to your email account {profile?.emailaddress} and click on Confirm Account button to verify your email account.
          </Text>
        </Layout>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '5%' }}>
          <Text style={{ textAlign: 'center' }} category="h6">
            Did not receive an email yet?
          </Text>
        </Layout>


        <Button
          onPress={() => {
            doVerify({
              url: GRCGDS_BACKEND,
              data: {
                "module_name": "RESEND_VERIFY_EMAIL",
                "id": profile?.id
              }
            })
              .then((r) => {
                console.log(r.data)
                dispatchGlobalState({ type: 'profile', state: profile })
              })

          }}
          size="giant"
          disabled={loading}
          accessoryRight={loading ? LoadingSpinner : undefined}
          style={{
            backgroundColor: loading == false ? '#41d5fb' : '#e4e9f2',
            borderColor: loading == false ? '#41d5fb' : '#e4e9f2',
            marginBottom: '15%',
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
          {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18 }}>Resend Email</Text>}
        </Button>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen