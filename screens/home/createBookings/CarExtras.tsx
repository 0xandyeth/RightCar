
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Text, Input, Button, Select, SelectItem, Popover, Toggle, Menu } from '@ui-kitten/components';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import SmoothPicker from "react-native-smooth-picker";
import Modal from 'react-native-modal';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCreateBookingState } from './CreateBookingState';
import TimeCheckbox from '../../../partials/TimeCheckbox';
import CarItem from '../../../partials/CarItem';
import { VehVendorAvail, PricedEquip } from '../../../types/SearchVehicleResponse';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import MenuButton from '../../../partials/MenuButton';
import Decimal from 'decimal.js';

type ParamList = {
    CarExtras: {
        vehicle: VehVendorAvail;
    };
};
export default () => {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<ParamList, 'CarExtras'>>();

    const [selectedExtras, setExtras] = useCreateBookingState("extras");
    const [showCounterModal, setShowCounterModal] = useState(false)
    const [amountSelected, setAmountSelected] = useState(0)
    const [selectedEquip, setSelectedEquip] = useState<PricedEquip | null>(null)

    return (
        <SafeAreaView style={{ flex: 1 }} >
            <ScrollView contentContainerStyle={{ flexGrow: 1, padding: '5%', justifyContent: 'space-between', display: 'flex' }} keyboardShouldPersistTaps={"handled"} style={{ backgroundColor: 'white' }}>
                <View style={{ position: 'absolute', zIndex: 2, padding: '5%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <MenuButton />
                </View>
                <Layout>
                    <CarItem style={{ marginBottom: '5%' }} centerCarName={true} vehicle={{
                        ...route.params.vehicle,
                        TotalCharge: {
                            ...route.params.vehicle.TotalCharge,
                            RateTotalAmount: new Decimal(route.params.vehicle.TotalCharge.RateTotalAmount).add(selectedExtras.reduce((total, next) => {
                                const extraTotal = new Decimal(next.Charge.Amount).times(next.amount);
                                total = new Decimal(total).add(extraTotal).toNumber()
                                return total
                            },0)).toFixed(2)
                        }
                        }} />

                    <Text style={{ marginBottom: '5%' }}>EQUIPEMENT (OPTIONAL EXTRAS)</Text>

                    {route.params.vehicle.PricedEquips.map(equip => {
                        const found = selectedExtras.find(i =>i.Equipment.vendorEquipID == equip.Equipment.vendorEquipID)
                        const currentPrice = found ? found.amount*equip.Charge.Amount: null;
                        return (
                            <TimeCheckbox
                                style={{ marginBottom: '5%' }}
                                title={`${equip.Equipment.Description} ${currentPrice ? `(${ResolveCurrencySymbol(found?.Charge.Taxamount.CurrencyCode)}${currentPrice})` : ''}`}
                                replaceCheckbox={() => {
                                    const found = selectedExtras.find(i => i.Equipment.Description == equip.Equipment.Description)
                                    return <View style={{ backgroundColor: found ? '#41d5fb' : 'white', borderColor: found ? 'white' : '#41d5fb', borderWidth: 1, borderRadius: 20, height: 35, width: 35, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        {found ?
                                            <Text style={{ fontSize: 15, color: 'white' }}>{found.amount}</Text>
                                            : <Text style={{ fontSize: 25, color: '#41d5fb' }} >+</Text>}
                                    </View>
                                }}
                                onChange={() => {
                                    setSelectedEquip(equip);
                                    setShowCounterModal(true)
                                }}
                            />
                        );
                    })}

                    <Layout style={{ marginTop: '5%' }}>
                        <Button
                            onPress={() => navigation.navigate('Payment', { vehicle: route.params.vehicle })}
                            size="giant" style={{
                                borderRadius: 10,
                                backgroundColor: '#41d5fb',
                                borderColor: '#41d5fb',
                                paddingLeft: 20,
                                paddingRight: 20,
                                marginBottom: '2%'
                            }}>
                            {() => <Text style={{ color: 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>CONTINUE</Text>}
                        </Button>
                    </Layout>
                </Layout>
            </ScrollView >
            <Modal
                onBackdropPress={() => setShowCounterModal(false)}
                isVisible={showCounterModal}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}>
                <Layout style={{ height: '40%', padding: '3%' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <AntDesignIcon
                                onPress={() => {
                                    setAmountSelected(p => {
                                        const v = p + 1
                                        if (v >= 16) return 16
                                        return v;
                                    })
                                }}
                                size={28}
                                name="down"
                            />
                            <AntDesignIcon
                                onPress={() => {
                                    setAmountSelected(p => {
                                        const v = p - 1
                                        if (v <= 0) return 0
                                        return v;
                                    })
                                }}
                                size={28}
                                name="up"
                            />
                        </View>
                        <Text style={{ color: '#41d5fb', fontSize: 18 }} onPress={() => {
                            setAmountSelected(0)
                            setShowCounterModal(false)
                            if (!selectedEquip) return
                            setExtras(p => {
                                const found = p.find(i => i.Equipment.vendorEquipID == selectedEquip.Equipment.vendorEquipID)
                                if (found) {
                                    const toReturn = [ ...p.filter(i => i.Equipment.vendorEquipID !== selectedEquip.Equipment.vendorEquipID) ]
                                    if (amountSelected != 0) toReturn.push({ ...selectedEquip, amount: amountSelected })
                                    return toReturn
                                    
                                }
                                return [...p, { ...selectedEquip, amount: amountSelected }]
                            })
                        }}>
                            Done
                        </Text>
                    </View>
                    <View style={{ height: '100%' }}>
                        <SmoothPicker
                            selectOnPress={true}
                            scrollAnimation
                            data={Array.from({ length: 16 }, (_, i) => i)}
                            onSelected={({ item, index }) => {
                                setAmountSelected(item)
                            }}
                            renderItem={({ item, index }) => (
                                <View style={{
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    width: '70%',
                                    height: 30,
                                    borderColor: '#41d5fb',
                                    borderWidth: item == amountSelected ? 1 : 0,
                                    borderRadius: 10
                                }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18 }}>{item}</Text>
                                </View>
                            )}
                        />
                    </View>
                </Layout>
            </Modal>

        </SafeAreaView>
    )
};
