import React, { useState, useEffect } from 'react';
import { Layout, Text } from '@ui-kitten/components';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Image, TouchableWithoutFeedback, ViewStyle, View } from 'react-native';
import ResolveDoors from '../utils/ResolveDoors';
import ResolveTransmission from '../utils/ResolveTransmission';
import ResolveCurrencySymbol from '../utils/ResolveCurrencySymbol';
import GetCategoryByAcrissCode from '../utils/GetCategoryByAcrissCode';
import { VehVendorAvail } from '../types/SearchVehicleResponse';

const hightLightStyles = {
    backgroundColor: '#41d5fb',
    priceColor: 'white'
}

type Props = {
    onClick?: () => void,
    isActive?: boolean,
    vehicle: VehVendorAvail
    style?: ViewStyle
}

const CarItem: React.FC<Props> = ({ vehicle, isActive, onClick, style: customeStyles }) => {
    const currentStyles = isActive ? hightLightStyles : { backgroundColor: 'white', priceColor: 'black' }

    return (
        <TouchableWithoutFeedback onPress={() => onClick && onClick()}>
            <Layout style={{ paddingLeft: '3%',paddingRight: '3%',borderBottomColor: 'gray', borderBottomWidth: 1,display: 'flex', flexDirection: 'column', backgroundColor: currentStyles.backgroundColor, ...customeStyles }}>
                <Layout style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '70%', backgroundColor: '#00000000' }}>
                    <View>
                        <Text style={{ fontSize: 14, fontFamily: 'SF-UI-Display_Bold', color: 'gray' }}>
                            {GetCategoryByAcrissCode(vehicle.Vehicle.VehType.VehicleCategory)}
                        </Text>
                        <Text style={{ fontSize: 16, fontFamily: 'SF-UI-Display_Bold', }}>{vehicle.Vehicle.VehMakeModel.Name}</Text>
                        <Text style={{ fontSize: 12, color: 'gray' }}>or similar</Text>
                    </View>

                    <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000' }}>
                        <Layout style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000000' }}>
                            <Image source={{ uri: vehicle.Vehicle.VehMakeModel.PictureURL }} style={{ flex: 1, width: 160, height: 160, resizeMode: 'contain' }} />
                        </Layout>

                        <Layout style={{ width: '90%', marginLeft: '10%',display: 'flex', flexDirection: 'column', backgroundColor: '#00000000' }}>
                            <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                <Image source={require('../image/door.png')} style={{ width: 20, height: 20 }} />
                                <Text>{ResolveDoors(vehicle.Vehicle.VehType.VehicleCategory)} doors</Text>
                            </Layout>
                            {(vehicle.Vehicle.VehClass.Size !== null && vehicle.Vehicle.VehClass.Size !== undefined && vehicle.Vehicle.VehClass.Size != 0) && (
                                <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Image source={require('../image/seats.png')} style={{ width: 20, height: 20 }} />
                                    <Text>{vehicle.Vehicle.VehClass.Size} seats</Text>
                                </Layout>
                            )}
                            {vehicle.Vehicle.AirConditionInd && (
                                <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Image source={require('../image/AC.png')} style={{ width: 20, height: 20 }} />
                                    <Text>Air Conditioning</Text>
                                </Layout>

                            )}
                            {ResolveTransmission(vehicle.Vehicle.VehType.VehicleCategory) && (
                                <Layout style={{ display: 'flex', flexDirection: 'row', marginBottom: '4%', backgroundColor: 'rgba(0,0,0,0)' }}>
                                    <Image source={require('../image/manual.png')} style={{ width: 20, height: 20 }} />
                                    <Text>{ResolveTransmission(vehicle.Vehicle.VehType.VehicleCategory)}</Text>
                                </Layout>
                            )}
                        </Layout>

                    </Layout>
                    <Layout style={{ backgroundColor: '#00000000' }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <FontAwesome5 style={{ marginRight: '2%' }} name={"gas-pump"} size={16} />
                            <Text style={{ fontSize: 13,fontFamily: 'SF-UI-Display_Bold' }}>
                                Fuel policy:{' '}
                            </Text>
                            <Text style={{ fontSize: 13 }}>Same to Same</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <FontAwesome5 style={{ marginRight: '2%' }} name={"road"} size={16} />
                            <Text style={{ fontSize: 13,fontFamily: 'SF-UI-Display_Bold' }}>Mileage:{' '}</Text>
                            <Text style={{ fontSize: 13 }}>Unlimited</Text>
                        </View>
                    </Layout>

                </Layout>
                <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', marginLeft: 'auto' }}>
                    <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: currentStyles.priceColor, fontSize: 18 }}>{ResolveCurrencySymbol(vehicle.TotalCharge.CurrencyCode || '')} </Text>
                    <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: currentStyles.priceColor, fontSize: 18 }}>{vehicle.TotalCharge.RateTotalAmount}</Text>
                </Layout>

            </Layout>
        </TouchableWithoutFeedback>
    );
}

export default CarItem
