import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, Alert } from 'react-native';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../state';
import { axiosInstance } from '../utils/AxiosBootstrap';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../partials/LoadingSpinner';
import { useNavigation } from '@react-navigation/native';

const DocumentScreen = () => {
  const [profile] = useGlobalState('profile');
  const navigation = useNavigation();

  const [{ data, loading, error }, doVerify] = useAxios({
    url: `${GRCGDS_BACKEND}`,
    method: 'POST'
  }, { manual: true })

  const inputs = [
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null),
    useRef<TextInput | null>(null)
  ]

  const [idxFocusInput, setIdxFocusInput] = React.useState<number>(-1);
  const [pin, setPin] = React.useState<Array<number>>([-1, -1, -1, -1]);

  const onInput = ({ nativeEvent: { key }, ...e }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {

    setPin(p => {
      if (key === 'Backspace') {
        //@ts-ignore
        let lastElemet = p.findIndex(i => i == -1);
        if (lastElemet == -1) lastElemet = p.length
        p[lastElemet - 1] = -1
        const nextInput = inputs[lastElemet - 2]
        if (nextInput && nextInput.current) nextInput.current?.focus()

        return [...p]
      }

      if (!RegExp(`[0-9]`).test(key)) return p

      const firstNull = p.indexOf(-1)
      if (firstNull !== -1) {
        p[firstNull] = parseInt(key)
        const nextInput = inputs[firstNull + 1]
        if (nextInput) nextInput.current?.focus()
      }
      return [...p]
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000' }}>
          <Text style={{ textAlign: 'left' }} category="h3">Verify phone number</Text>
          <Text category="s1"> Check your SMS messages. We've sent you the PIN at </Text>
          <Text style={{ color: '#41d5fb' }}>({profile?.mobilecode}) {profile?.mobilenumber}</Text>
        </Layout>


        <Layout style={{ display: 'flex', flexDirection: 'row', height: '20%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#00000000', marginTop: '15%', marginBottom: '15%' }}>
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(0) }} ref={ref => inputs[0].current = ref} value={pin[0] !== -1 ? pin[0].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: 'SF-UI-Display_Bold', borderColor: idxFocusInput == 0 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(1) }} ref={ref => inputs[1].current = ref} value={pin[1] !== -1 ? pin[1].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: 'SF-UI-Display_Bold', borderColor: idxFocusInput == 1 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(2) }} ref={ref => inputs[2].current = ref} value={pin[2] !== -1 ? pin[2].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: 'SF-UI-Display_Bold', borderColor: idxFocusInput == 2 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
          <TextInput onBlur={() => { setIdxFocusInput(-1) }} onFocus={() => { setIdxFocusInput(3) }} ref={ref => inputs[3].current = ref} value={pin[3] !== -1 ? pin[3].toString() : ''} onKeyPress={(e) => { onInput(e) }} maxLength={1} style={{ textAlign: 'center', fontFamily: 'SF-UI-Display_Bold', borderColor: idxFocusInput == 3 ? '#41D5FB' : '#2f378c', borderWidth: 1, backgroundColor: 'white', borderRadius: 30, fontSize: 34, height: 80, width: '20%' }} />
        </Layout>

        <Button
          onPress={() => {
            if (profile && profile.vphone != 1) {
              doVerify({
                url: GRCGDS_BACKEND,
                data: {
                  "module_name": "VERIFY",
                  "code": parseInt(pin.join(""))
                }
              })
              .then(() => {
                dispatchGlobalState({ type: 'profile', state: {...profile, vphone: 1 } })
                if (profile.vemail == 0) {
                  navigation.navigate('SuccessEmail')
                } else if (profile.vemail == 1){
                  console.log('going home', profile.vphone)
                  navigation.navigate('Home')
                } else {
                  dispatchGlobalState({ type: 'logout' })
                }
              })
              return
            }

            if (profile && profile.twoauth != 0) {
              doVerify({
                url: GRCGDS_BACKEND,
                data: {
                  "module_name": "VERIFY_OPT",
                  "code": parseInt(pin.join(""))
                }
              })
              .then((res) => {
                dispatchGlobalState({ type: 'token', state: res.data.token })
                dispatchGlobalState({ type: 'profile', state: res.data })
                if (res.data.vphone != 1) navigation.navigate('Opt')
                if (res.data.vemail != 1) navigation.navigate('VerifyEmail')
                if (res.data.vphone == 1 && res.data.vemail == 1) navigation.navigate('Home')
              })
            }
            
              
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
          {() => <Text style={{ color: 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>Verify</Text>}
        </Button>
        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000' }}>
          <Text style={{ textAlign: 'center' }}>Didn't receive SMS </Text>
          <Text
            onPress={() => {
              if (!profile) return
              
              if (profile && profile.vphone != 1) {
                doVerify({ data: {
                  "module_name": "RESEND_VERIFY",
                  "id": profile.id
                }})
                .then(() => {
                  setPin([-1, -1, -1, -1])
                })
                return
              }

              if (profile && profile.twoauth != 0) {
                doVerify({
                  url: GRCGDS_BACKEND,
                  data: {
                    "module_name": "RESEND_VERIFY_OPT",
                    "id": profile.id
                  }
                })
                .then(() => {
                  setPin([-1, -1, -1, -1])
                })
              }

            }}
            style={{ color: '#41d5fb' }}>Resend Code</Text>
        </Layout>

        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000', marginTop: '5%' }}>
          <Text
            onPress={() => {
              navigation.navigate('Login')
            }}
            style={{ color: '#41d5fb' }}>Verify later</Text>
        </Layout>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen