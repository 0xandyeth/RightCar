import React, { useRef, useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData, View } from 'react-native';
// @ts-ignore
import GPSState from 'react-native-gps-state'
//@ts-ignore
import GetLocation from 'react-native-get-location'
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import BackButton from '../../../partials/BackButton';
import MenuButton from '../../../partials/MenuButton';
import MapView from 'react-native-maps';

const DocumentScreen = () => {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      if (!GPSState.isAuthorized()) {
        GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE)
      }

      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          setCurrentLocation(location)
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
        })

    }, [])
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>

      <View style={{ display: 'flex', height: '100%', zIndex: -2 }}>
        {currentLocation && <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0,
            longitudeDelta: 0.0
          }}
        >
        </MapView>}


        {!currentLocation && (
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text category="h2">Fetching your location...</Text>
            <LoadingSpinner />
          </View>
        )}
      </View>

      <Layout style={{ position: 'absolute',padding: '5%',backgroundColor: 'red', zIndex: 2, display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center', justifyContent: 'center' }}>
        <MenuButton />
      </Layout>



      <Layout style={{ padding: '5%',position: 'absolute',display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '15%', marginBottom: '10%' }}>
        <Text style={{ fontFamily: 'SF-UI-Display_Bold', textAlign: 'center' }} category="h3">No result :(</Text>
        <Text style={{ color: '#8F9BB3', textAlign: 'center', marginBottom: '50%' }} category="h6">
          Sorry there are no vehicles available in your area at the moment
          </Text>
      </Layout>

      <Button
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack()
          }
        }}
        size="giant"
        style={{
          top: '80%',
          left: '10%',
          width: '80%',
          position: 'absolute',
          backgroundColor: '#41d5fb',
          borderColor: '#41d5fb',
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
        {() => <Text style={{ color: 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>Go Back</Text>}
      </Button>

    </SafeAreaView>
  );
};

export default DocumentScreen