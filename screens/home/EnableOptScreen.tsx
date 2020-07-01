import React, { useRef } from 'react';
import { Layout, Text, Button, Datepicker, NativeDateService, TabView, Card, Avatar } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppFontBold, AppFontRegular } from '../../constants/fonts'

const DocumentScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginBottom: '60%' }}>
          <Text style={{ textAlign: 'center', fontFamily: AppFontBold }} category="h3">Do you want to enable 2-factor authentication</Text>
        </Layout>


        <Button
          onPress={() => navigation.navigate('VerifyPhone')}
          size="giant"
          style={{
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
          {() => <Text style={{ color: 'white', fontFamily: AppFontBold, fontSize: 18}}>Enable it</Text>}
                            </Button>
        <Layout style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', backgroundColor: '#00000000' }}>
          <Text onPress={() => {
            navigation.navigate('MyBookings')
          }} style={{ textAlign: 'center', color: '#41d5fb' }}>Skip for now</Text>
        </Layout>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen