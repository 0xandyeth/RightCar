import React from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Image, TouchableWithoutFeedback } from 'react-native';
import { Layout, Text, Card, Avatar, Button, Divider } from '@ui-kitten/components';
import { useNavigation } from '@react-navigation/native';
import ResolveCurrencySymbol from '../utils/ResolveCurrencySymbol';
import useAxios from 'axios-hooks'
import Decimal from 'decimal.js';

export type TripCardProps = {
  pickupLocation: string
  pickupTime: moment.Moment
  dropOffLocation: string
  dropoffTime: moment.Moment

  carName: string
  registratioNumber: string
  finalCost: string
  currencyCode: string

  leftImageUri?: string

  reservationNumber?: string

  keyLess: boolean

  completed?: boolean
  upcoming?: boolean

  image_preview_url: string

  confirmation?: boolean

}
const CarTripInfoCard: React.FC<TripCardProps> = (props) => {
  const navigation = useNavigation();

  const [{ data, loading, error }] = useAxios({
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${props.pickupLocation} ${props.pickupCountry}&destinations=${props.dropOffLocation} ${props.dropoffCountry}&key=AIzaSyBJ8evu2aDcSyb2F2NIuNQ3L5TeLAGpino`
  })

  return (
    <Layout style={{ backgroundColor: '#00000000', marginBottom: '5%' }}>
      <Layout style={{ backgroundColor: '#00000000', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Text style={{ marginBottom: '3%', color: '#ACB1C0' }}>{props.pickupTime.format('LLL')}</Text>
        {props.leftImageUri && (
          <Image
            style={{ width: 50, height: 50 }}
            source={require('../image/rightcars.png')}
          />
        )}

      </Layout>

      <TouchableWithoutFeedback onPress={() => navigation.navigate('Activate', { ...props, leftImageUri: undefined })} style={{ display: 'flex', flexDirection: 'column', borderRadius: 16, borderWidth: 0 }}>
        <>
          {props.reservationNumber && (
            <Layout style={{ marginBottom: '3%' }}>
              <Text style={{ textAlign: 'center' }} category="h6">
                CONFIRMATION
              </Text>
              <Text style={{ textAlign: 'center' }} category="h6">
                Reservation Number
              </Text>
              <Text style={{ textAlign: 'center',fontFamily: 'SF-UI-Display_Bold' }} category="h6">
                {props.reservationNumber}
              </Text>
            </Layout>
          )}
          {(props.confirmation == true || props.confirmation == undefined) && (
            <>
              <Text style={{ textAlign: 'center', color: 'blue' }} category="h6">
                PAYMENT HAS BEEN TAKEN FROM YOUR ACCOUNT
          </Text>
            </>
          )}
          <Layout style={{ display: 'flex', flexDirection: 'row', paddingTop: '5%', paddingLeft: '5%', paddingRight: '5%', borderTopRightRadius: 16, borderTopLeftRadius: 16 }}>
            <Layout style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', marginRight: '5%' }}>
              <FontAwesomeIcon size={15} style={{ color: '#41d5fb' }} name="circle" />
              <Layout style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around' }}>
                <MaterialCommunityIcon style={{ marginBottom: '15%' }} size={4} name="rectangle" />
                <MaterialCommunityIcon style={{ marginBottom: '15%' }} size={4} name="rectangle" />
                <MaterialCommunityIcon style={{ marginBottom: '15%' }} size={4} name="rectangle" />
                <MaterialCommunityIcon size={4} name="rectangle" />
              </Layout>
              <FontAwesomeIcon size={15} name="square" />
            </Layout>
            <Layout style={{ display: 'flex', flexDirection: 'column', width: '90%' }}>
              <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '5%' }}>
                <Text style={{ fontSize: 16, fontFamily: 'SF-UI-Display_Bold' }}>{props.pickupLocation}</Text>
                <Text style={{ color: '#ACB1C0', fontSize: 13 }}>{props.pickupTime.format('HH:mm')}</Text>
              </Layout>
              <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 16, fontFamily: 'SF-UI-Display_Bold' }}>{props.dropOffLocation}</Text>
                <Text style={{ color: '#ACB1C0', fontSize: 13 }}>{props.dropoffTime.format('DD MMM, HH:mm')}</Text>
              </Layout>
            </Layout>
          </Layout>
          <Layout style={{ display: 'flex', alignItems: 'center' }}>
            <Image source={{ uri: props.image_preview_url }} style={{ width: 180, height: 180, resizeMode: 'contain' }} />
          </Layout>
          <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '5%', paddingLeft: '5%', paddingRight: '5%', borderBottomLeftRadius: (props.upcoming || props.completed) ? 0 : 16, borderBottomRightRadius: (props.upcoming || props.completed) ? 0 : 16 }}>
            <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',width: '100%' }}>
              <Layout style={{ display: 'flex'}}>
                <Text style={{ fontFamily: 'SF-UI-Display_Bold', fontSize: 16 }} numberOfLines={1} textBreakStrategy="balanced" category='h6'>{props.carName}</Text>
              </Layout>
              <Layout style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text style={{ color: '#ACB1C0', fontSize: 13 }}>Final cost</Text>
                <Text style={{ fontSize: 15, fontFamily: 'SF-UI-Display_Bold' }}>{new Decimal(props.finalCost || 0).toFixed(2)}{ResolveCurrencySymbol(props.currencyCode)}</Text>
              </Layout>
            </Layout>

          </Layout>
          {(props.upcoming || props.completed) && (<Layout style={{ paddingBottom: '5%', paddingLeft: '5%', paddingRight: '5%', borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}>

            {props.upcoming && (
              <Button style={{ backgroundColor: '#cf1830', borderColor: '#cf1830', borderRadius: 10 }} size={'small'}>
                {() => <Text style={{ color: 'white' }}>Cancel</Text>}
              </Button>
            )}
            {props.completed && (
              <Button style={{ backgroundColor: '#41D5FB', borderColor: '#41D5FB', borderRadius: 10 }} size={'small'}>
                {() => <Text style={{ color: 'white' }}>Generate Invoice</Text>}
              </Button>
            )}
          </Layout>)}

        </>
      </TouchableWithoutFeedback>
    </Layout>

  );
}

export default CarTripInfoCard