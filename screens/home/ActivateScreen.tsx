import React from 'react';
import { Layout, Text, Button, Datepicker, NativeDateService, TabView, Card, Avatar, Modal } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image } from 'react-native';
import useAxios from 'axios-hooks'
import TripCard, { TripCardProps } from '../../partials/TripCard';
import { useRoute, useNavigation } from '@react-navigation/native';
import { GRCGDS_BACKEND } from 'react-native-dotenv'

import { NativeModules, NativeEventEmitter } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LoadingSpinner from '../../partials/LoadingSpinner';

const eventEmitter = new NativeEventEmitter();

eventEmitter.addListener('DeviceStatus', (event) => {
  console.log(event) // "someValue"
});

eventEmitter.addListener('turnOnBluetoothDevice', (event) => {
  console.log(event) // "someValue"
});

const DocumentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [{ data, loading, error }, getKeys] = useAxios({
    url: `${GRCGDS_BACKEND}/public/keyRings`,
  }, { manual: true })

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView >


        <Layout style={{ padding: '5%', backgroundColor: '#f7f9fc' }}>
          <TripCard
            {...route.params as TripCardProps}
          />

          <Layout style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000000' }}>
            <Image
              style={{ width: 110, height: 110 }}
              source={require('../../image/start.png')}
            />
            <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#00000000', width: '100%' }}>
              <Image
                style={{ width: 80, height: 80 }}
                source={require('../../image/lock.png')}
              />
              <Image
                style={{ width: 80, height: 80 }}
                source={require('../../image/g1.jpg')}
              />
              <TouchableWithoutFeedback onPress={() => {
                if (loading) return
                getKeys()
                  .then(res => {
                    const { tacsKeyring } = res.data

                    const { tacsLeaseTokenTable, tacsSorcBlobTable } = tacsKeyring
                    const { blob } = tacsSorcBlobTable[0]

                    NativeModules.HelloWorld.init(tacsLeaseTokenTable[0], blob)
                    NativeModules.HelloWorld.onUnlockDoorsClick()
                  })
              }}>
                <Image
                  style={{ width: 80, height: 80 }}
                  source={require('../../image/unlock.png')}
                />
              </TouchableWithoutFeedback>
            </Layout>
          </Layout>

          <Layout style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#00000000' }}>
            <Text category="h4">ODOMETER 00056887</Text>
            <Text style={{ fontSize: 45 }} category="h1">LOCKED</Text>
          </Layout>

          <Layout style={{ backgroundColor: '#00000000' }}>
            <Button onPress={() => navigation.navigate('EndRental', { ...route.params })} size="giant" style={{ borderRadius: 10, backgroundColor: '#5ac8fa', borderColor: '#5ac8fa', paddingLeft: 20, paddingRight: 20, marginBottom: '2%' }}>
              {() => <Text style={{ color: 'white' }}>END RENTAL</Text>}
            </Button>
            <Button onPress={() => navigation.navigate('Damage', { ...route.params })} size="giant" style={{ borderRadius: 10, backgroundColor: '#cf1830', borderColor: '#cf1830', paddingLeft: 20, paddingRight: 20 }}>
              {() => <Text style={{ color: 'white' }}>HELP</Text>}
            </Button>
          </Layout>

        </Layout>

      </ScrollView >
      <Modal
        visible={loading}
        backdropStyle={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
        <Card style={{ display: 'flex', justifyContent: 'center'}} disabled={true}>
          <LoadingSpinner styles={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} />
          <Text category="h6">Making request...</Text>
        </Card>
      </Modal>

    </SafeAreaView>
  );
};

export default DocumentScreen