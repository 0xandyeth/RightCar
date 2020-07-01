import React, { useEffect } from 'react';
import { Layout, Text, Card } from '@ui-kitten/components';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView, ScrollView, Image, Alert, View } from 'react-native';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import { useRoute, useNavigation } from '@react-navigation/native';
import useAxios from 'axios-hooks'
import { Linking } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import ResolveCurrencySymbol from '../../../utils/ResolveCurrencySymbol';
import ReportScreen from './ReportScreen';
import KeyedReservationScreen from './KeyedReservation';
import VerifyCancelCodeScreen from './VerifyCancelCodeScreen';
import CompletedReportScreen from './CompletedReportScreen';
import AgreementScreen from './AgreementScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCarDetailState } from './detailsState';
import MenuButton from '../../../partials/MenuButton';

const DocumentScreen = () => {
  const route = useRoute();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f6f7f9', }}>
      <ScrollView contentContainerStyle={{ backgroundColor: 'white', flexGrow: 1 }}>
        <View style={{ paddingTop: '5%', height: '90%', paddingLeft: '5%', paddingRight: '5%', display: 'flex', flexDirection: 'column' }}>
          <View style={{ width: '100%' }}>
            <Layout style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
              <View style={{ position: 'absolute',height: '100%', display: 'flex', alignItems: 'center' }}>
                <MenuButton />
              </View>
              <View style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Text style={{ textAlign: 'center' }} category="h5">
                  CONFIRMATION
              </Text>
                <Text style={{ lineHeight: 20, textAlign: 'center', fontFamily: 'SF-UI-Display_Bold', fontSize: 22 }} >
                  {route.params.registratioNumber}{' '}
                </Text>
                <Image
                  style={{ width: 200, height: 200, resizeMode: 'contain' }}
                  source={{ uri: route.params.image_preview_url }}
                />
              </View>
            </Layout>

            <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: 'SF-UI-Display_Bold' }} category="s1">
                  Pickup Location
                  </Text>
                <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display', fontSize: 16 }}>
                  {route.params.pickupLocation}
                </Text>
              </Layout>

              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: 'SF-UI-Display_Bold' }} category="s1">
                  Dropout Location
              </Text>
                <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display', fontSize: 16 }}>
                  {route.params.dropOffLocation}
                </Text>
              </Layout>
            </View>

            <View style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-around' }}>
              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: 'SF-UI-Display_Bold' }} category="s1">
                  Pickup Time
                  </Text>
                <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display', fontSize: 16 }}>
                  {route.params.pickupTime.format('HH:mm')}
                </Text>
              </Layout>

              <Layout style={{ marginBottom: '3%' }}>
                <Text style={{ textAlign: 'center', color: 'grey', fontFamily: 'SF-UI-Display_Bold' }} category="s1">
                  Dropout Time
              </Text>
                <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display', fontSize: 16 }}>
                  {route.params.dropoffTime.format('HH:mm')}
                </Text>
              </Layout>
            </View>


            <Layout style={{ marginBottom: '3%' }}>
              <Text style={{ textAlign: 'center', color: 'grey', fontFamily: 'SF-UI-Display_Bold' }} category="s1">
                Final Cost
              </Text>
              <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display', fontSize: 16 }}>
                {route.params.finalCost}
                {ResolveCurrencySymbol(route.params.currencyCode)}
              </Text>
            </Layout>

            <Layout style={{ width: '75%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Text style={{ textAlign: 'center', color: 'grey', fontFamily: 'SF-UI-Display_Bold' }} category="s1">
                Pickup Instructions
              </Text>
              <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display', fontSize: 18 }}>
                {route.params.pickUpInstructions}
              </Text>
            </Layout>
          </View>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};



const Tab = createBottomTabNavigator();
export default function App({ navigation, route }) {
  const [, setDetails] = useCarDetailState("details");

  useEffect(() => {
    setDetails(route.params.params)
  }, [])

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={DocumentScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="CompletedReport"
        component={CompletedReportScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="Agreement"
        component={AgreementScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="KeyedReservation"
        component={KeyedReservationScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="VerifyCancel"
        component={VerifyCancelCodeScreen}
        options={{
          tabBarButton: () => <></>,
        }}
      />

      <Tab.Screen
        name="Directions"
        component={() => <></>}
        options={{
          tabBarButton: () => {
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity style={{ height: '100%' }} onPress={() => {
                  navigation.navigate('KeyedReservation', route.params.params)
                  return

                }}>
                  <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', borderColor: 'rgba(0,0,0,0.2)', borderRightWidth: 0 }}>
                    <MaterialIcons name="location-on" style={{ color: '#41d5fb' }} size={24} />
                    <Text style={{ marginLeft: '5%', color: 'gray', fontFamily: 'SF-UI-Display', fontSize: 12 }}>DIRECTIONS</Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
      <Tab.Screen
        name="Help"
        component={() => <></>}
        options={{
          tabBarButton: () => {
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity style={{ height: '100%' }} onPress={() => {
                  Linking.openURL(`tel:${route.params.params.pickupLocationPhoneNumber}`)
                }}>
                  <View style={{ height: '100%', borderColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                    <MaterialIcons name="phone" style={{ color: '#41d5fb' }} size={24} />
                    <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'SF-UI-Display', fontSize: 12 }}>HELP</Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarButton: () => {
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity style={{ height: '100%' }} onPress={() => {
                  navigation.navigate('Report', { ...route.params })
                }}>
                  <View style={{ height: '100%', borderColor: 'rgba(0,0,0,0.2)', borderRightWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', }}>
                    <MaterialIcons name="directions-car" style={{ color: '#41d5fb' }} size={24} />
                    <Text style={{ textAlign: 'center', color: 'gray', fontFamily: 'SF-UI-Display', fontSize: 12 }}>COLLECT</Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />

      <Tab.Screen
        name="Cancel"
        component={() => <></>}
        options={{
          tabBarButton: () => {
            return (
              <View style={{ width: '25%' }}>
                <TouchableOpacity style={{ height: '100%' }} onPress={() => {
                  navigation.navigate('VerifyCancel', { ...route.params.params })
                }}>
                  <View style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderColor: 'rgba(0,0,0,0.2)', borderRightWidth: 0, flexDirection: 'column' }}>
                    <MaterialIcons name="cancel" style={{ color: '#cf1830' }} size={24} />
                    <Text style={{ marginLeft: '5%', color: 'gray', fontFamily: 'SF-UI-Display', fontSize: 12 }}>CANCEL </Text>
                  </View>

                </TouchableOpacity>
              </View>
            );
          }
        }}
      />
    </Tab.Navigator>
  );
}
