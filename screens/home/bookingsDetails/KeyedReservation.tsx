
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image, View } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import MapView from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
//@ts-ignore
import GetLocation from 'react-native-get-location'
// @ts-ignore
import GPSState from 'react-native-gps-state'
import useAxios from 'axios-hooks'
import TripCard from '../../../partials/TripCard';
import LoadingSpinner from '../../../partials/LoadingSpinner';


export default () => {
    const navigation = useNavigation();
    const route = useRoute();
    const returnAddressString = `${route.params.pLocationAddress._.replace(/ /g, '+')}${route.params.pLocationAddress.CountryName[0].Name[0]}`
    const [currentLocation, setCurrentLocation] = useState(null);

    const [returnLocationReq, refetchReturn] = useAxios({
        url: `https://maps.googleapis.com/maps/api/geocode/json?address=${returnAddressString}&key=AIzaSyBJ8evu2aDcSyb2F2NIuNQ3L5TeLAGpino`,
    })

    useFocusEffect(
        React.useCallback(() => {
            if (!GPSState.isAuthorized()){
                GPSState.requestAuthorization(GPSState.AUTHORIZED_WHENINUSE)
            }
            refetchReturn();

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
        <SafeAreaView style={{ flex: 1, justifyContent: 'flex-start' }} >
            <View style={{ display: 'flex', height: '90%' }}>
                {(returnLocationReq.data && !returnLocationReq.loading && currentLocation) && <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: currentLocation.latitude,
                        longitude: currentLocation.longitude,
                        latitudeDelta: 0.0,
                        longitudeDelta: 0.0
                    }}
                >
                    <MapViewDirections
                        origin={{
                            latitude: currentLocation.latitude,
                            longitude: currentLocation.longitude
                        }}
                        destination={{
                            latitude: returnLocationReq.data.results[0].geometry.location.lat,
                            longitude: returnLocationReq.data.results[0].geometry.location.lng
                        }}
                        onError={(err) => console.log(err)}
                        strokeWidth={2}
                        strokeColor={'#FB4A46'}
                        lineCap={'round'}
                        apikey={'AIzaSyBJ8evu2aDcSyb2F2NIuNQ3L5TeLAGpino'}
                    />
                </MapView>}


                {!currentLocation && returnLocationReq.loading && (
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="h2">Loading your route...</Text>
                        <LoadingSpinner />
                    </View>
                )}

                {returnLocationReq.error && (
                    <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="h2">We could not load your route</Text>
                    </View>
                )}
                {(returnLocationReq.data && !currentLocation && !returnLocationReq.loading) && <Button onPress={() => {

                }} size="small" style={{ position: 'absolute', right: 0, marginTop: '2%', marginLeft: '2%', borderRadius: 10, backgroundColor: '#cf1830', borderColor: '#cf1830', width: '30%' }}>
                    {() => <Text style={{ color: 'white' }}>HELP</Text>}
                </Button>}
            </View>

        </SafeAreaView>
    )
};
