
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import moment from 'moment';
import TripCard from '../../partials/TripCard';
import ResolveCurrencySymbol from '../../utils/ResolveCurrencySymbol';


export default () => {
    const navigation = useNavigation();
    const route = useRoute();

    console.log(route.params)

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>

                <Layout>
                    <TripCard
                        {...route.params}
                    />

                    <Text style={{ textAlign: 'center', color: '#d1021b', fontSize: 22 }}>DURATION {route.params.pickupTime.add(1, 'h').diff(route.params.dropoffTime, 'hour')} Hrs - Mileage 23 Miles</Text>
                    <Text style={{ textAlign: 'center', color: '#d1021b', fontSize: 22 }}> TOTAL COST OF RENTAL {ResolveCurrencySymbol(route.params.currency)} {route.params.finalCost} </Text>

                    <Layout style={{ position: 'relative',display: 'flex', alignItems: 'center', justifyContent: 'flex-end',height: 280}}>
                        <Image source={require('../../image/map.jpg')} style={{ position: 'absolute',flex: 1, width: 280, height: 280, resizeMode: 'contain' }} />
                        <Text style={{ textAlign: 'center', color: '#d1021b', fontSize: 22 }}>
                            WHEN DEPARTING THE VEHICLE
                            PLEASE MAKE SURE YOU
                            COLLECT ALL YOUR BELONGING
                        </Text>
                    </Layout>


                    <Layout style={{ marginTop: '5%' }}>
                        <Button
                            onPress={() => navigation.navigate('MyBookings')}
                            size="giant" style={{
                                borderRadius: 10,
                                backgroundColor: '#41d5fb',
                                borderColor: '#41d5fb',
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: '2%'
                            }}>
                            {() => <Text style={{ color: 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>Go My Trips</Text>}
                        </Button>
                    </Layout>
                </Layout>
            </ScrollView >

        </SafeAreaView>
    )
};
