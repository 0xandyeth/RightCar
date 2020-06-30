
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { Decimal } from 'decimal.js';
import { useCreateBookingState } from './CreateBookingState';
import moment from 'moment';
import TripCard from '../../../partials/TripCard';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import CarTripInfoCard from '../../../partials/CarTripInfoCard';


export default () => {
    const navigation = useNavigation();
    const route = useRoute();

    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");
    const [originLocation, setOriginLocation] = useCreateBookingState("originLocation");
    const [returnLocation, setReturnLocation] = useCreateBookingState("returnLocation");
    const [arrivalTime, setArrivalTime] = useCreateBookingState("arrivalTime");
    const [reservationNumber] = useCreateBookingState("reservationNumber");
    const [, setExtras] = useCreateBookingState("extras");
    const [, setVehicle] = useCreateBookingState("vehicle");

    const [extras] = useCreateBookingState("extras");
    const [vehicle] = useCreateBookingState("vehicle");

    const totalToCharge = new Decimal(vehicle?.TotalCharge.RateTotalAmount || '0.0').add(extras.reduce((prev, next) => {
        prev = new Decimal(next.Charge.Amount).times(next.amount).add(prev).toNumber()
        return prev
    }, 0)).toString()

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>

                <Layout>
                    <CarTripInfoCard
                        pickupLocation={originLocation?.locationname || ''}
                        pickupTime={moment(departureTime)}
                        dropOffLocation={returnLocation?.locationname || ''}
                        dropoffTime={moment(returnTime)}

                        carName={vehicle?.Vehicle.VehMakeModel.Name || 'Car'}
                        finalCost={totalToCharge.toString()}
                        currencyCode={vehicle?.TotalCharge.CurrencyCode || 'USD'}
                        arrivalTime={arrivalTime}
                        image_preview_url={vehicle?.Vehicle.VehMakeModel.PictureURL}
                        reservationNumber={reservationNumber}

                        leftImageUri={undefined}
                        keyLess={false}
                    />

                    <Layout style={{ marginTop: '5%' }}>
                        <Button
                            onPress={() => {
                                setTimeout(() => {
                                    setDepartureTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                                    setReturnTime(moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0 }).toDate());
                                    setOriginLocation(null)
                                    setReturnLocation(null)
                                    setArrivalTime('');
                                    setExtras([])
                                    setVehicle(null)
                                }, 2000);
                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 1,
                                        routes: [
                                            { name: 'Home' },
                                        ],
                                    })
                                );
                            }}
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
