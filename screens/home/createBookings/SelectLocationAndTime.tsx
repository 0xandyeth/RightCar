
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, List, Toggle } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, View, TouchableHighlight, TouchableWithoutFeedback, Dimensions } from 'react-native';
import DatePicker from 'react-native-date-picker'
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import { useCreateBookingState } from './CreateBookingState';
import TimeCheckbox from '../../../partials/TimeCheckbox';
import LocationSearchInput from '../../../partials/SearchLocationInput';
import Modal from 'react-native-modal';
import useAxios from 'axios-hooks'
import moment from 'moment';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { VehicleResponse } from '../../../types/SearchVehicleResponse';


export default () => {
    const navigation = useNavigation();
    const [originLocation, setOriginLocation] = useCreateBookingState("originLocation");
    const [returnLocation, setReturnLocation] = useCreateBookingState("returnLocation");
    const [inmediatePickup, setInmediatePickup] = useCreateBookingState("inmediatePickup");
    const [departureTime, setDepartureTime] = useCreateBookingState("departureTime");
    const [returnTime, setReturnTime] = useCreateBookingState("returnTime");

    const [{ data, loading, error }, doSearch] = useAxios<VehicleResponse>({
        url: `${GRCGDS_BACKEND}/SEARCH_VEHICLE`,
        method: 'GET',
        validateStatus: () => true
    }, { manual: true })

    useEffect(() => {
        if (inmediatePickup == true) {
            setDepartureTime(moment().toDate())
        }
    }, [inmediatePickup])

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>

                <Layout>
                    <LocationSearchInput
                        pickupLocation={originLocation}
                        returnLocation={returnLocation}
                        onOriginLocationSelected={(l) => {
                            setOriginLocation(l)
                            setReturnLocation(l)
                        }}
                        onReturnLocationSelected={(l) => setReturnLocation(l)}
                    />

                    <TimeCheckbox
                        checked={inmediatePickup == undefined ? undefined : inmediatePickup}
                        style={{ marginBottom: '5%' }}
                        title="IMMEDIATE PICKUP"
                        subTitle="Collect A Car Near Me Immediately"
                        onChange={(v) => setInmediatePickup(p => {
                            if (p === null) return true
                            return !p
                        })}
                    />
                    <TimeCheckbox
                        checked={inmediatePickup == undefined ? undefined : !inmediatePickup}
                        title="SCHEDULE A PICKUP IN ADVANCE"
                        onChange={(v) => {
                            setInmediatePickup(p => {
                                if (p === null) return false
                                return !p
                            })
                        }}
                    />
                    {inmediatePickup !== null && (
                        <>
                        <DatePicker
                            minuteInterval={30}
                            date={departureTime}
                            onDateChange={(d) => {
                                if (inmediatePickup) {
                                    const nowPlus24Hours = moment().utc().add('h', 24).set({ minutes: 0, seconds: 0 })
                                    if (moment(d).isAfter(nowPlus24Hours)) {
                                        setDepartureTime(nowPlus24Hours.toDate())
                                    } else {
                                        setDepartureTime(d)
                                    }
                                } else {
                                    setDepartureTime(d)
                                }
                                setReturnTime(moment(d).add('days', 1).toDate())
                            }}
                        />
                        <Text style={{ fontFamily: 'SF-UI-Display_Bold' }}>Return Time</Text>
                        <DatePicker
                            minuteInterval={30}
                            date={returnTime}
                            onDateChange={(d) => setReturnTime(d)}
                        />
                        </>
                    )}
                </Layout>
                <Layout style={{ marginTop: '5%' }}>
                    <Button
                        disabled={originLocation == null || inmediatePickup == null || loading == true}
                        accessoryRight={loading ? LoadingSpinner : undefined}
                        onPress={() => {
                            if (!originLocation) return

                            doSearch({
                                params: {
                                    module_name: "SEARCH_VEHICLE",

                                    pickup_date: moment(departureTime).format(`YYYY-MM-DD`),
                                    pickup_time: moment(departureTime).format(`HH:ss`),

                                    dropoff_date: moment(returnTime).format(`YYYY-MM-DD`),
                                    dropoff_time: moment(returnTime).format(`HH:ss`),

                                    pickup_location: originLocation.internalcode,
                                    dropoff_location: returnLocation ? returnLocation.internalcode : originLocation.internalcode,
                                }
                            })
                                .then(res => {
                                    if (res.data.VehAvailRSCore.VehVendorAvails.length == 0) {
                                        navigation.navigate("NoResult");
                                    } else {
                                        navigation.navigate(
                                            'CarsList',
                                            {
                                                cars: res.data.VehAvailRSCore.VehVendorAvails,
                                                metadata: res.data.VehAvailRSCore.VehRentalCore,
                                                searchParams: {
                                                    pickUpDate: moment(departureTime),
                                                    pickUpTime: moment(departureTime),

                                                    dropOffDate: moment(returnTime),
                                                    dropOffTime: moment(returnTime),

                                                    pickUpLocation: originLocation,
                                                    dropOffLocation: returnLocation ? returnLocation : originLocation,
                                                }
                                            }
                                        );
                                    }
                                })
                                .catch(() => {
                                    navigation.navigate("NoResult");
                                })
                        }} size="giant" style={{
                            borderRadius: 10,
                            backgroundColor: (originLocation != null && inmediatePickup != null) && loading == false ? '#41d5fb' : '#e4e9f2',
                            borderColor: (originLocation != null && inmediatePickup != null) && loading == false ? '#41d5fb' : '#e4e9f2',
                            paddingLeft: 20,
                            paddingRight: 20,
                            marginBottom: '2%'
                        }}>
                        {() => <Text style={{ color: loading ? "#ACB1C0" : 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>Search</Text>}
                    </Button>
                </Layout>
            </ScrollView >
        </SafeAreaView>
    )
};
