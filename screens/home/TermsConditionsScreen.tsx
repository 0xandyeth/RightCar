import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MenuButton from '../../partials/MenuButton';

const DocumentScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1 }}>

      <Layout style={{ flex: 1, padding: '5%', backgroundColor: 'white' }}>

        <Layout style={{ display: 'flex', flexDirection: 'row', backgroundColor: '#00000000', alignItems: 'center' }}>
          <MenuButton />
        </Layout>

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '10%', marginBottom: '10%' }}>
          <Text style={{ marginBottom: '5%', textAlign: 'center' }} category="h3">
            Terms and Conditions
          </Text>

          <Text style={{ textAlign: 'center'}} category="h6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec dictum lorem quis leo molestie fermentum. Nunc felis ipsum, laoreet id lacus non, vulputate mollis risus. Donec ut vulputate mauris, non molestie nunc. Nam ut eros quis diam consequat lobortis quis sit amet sapien. Nunc eget eros quam. Sed convallis mi vitae gravida dictum. Sed vehicula convallis tristique. Sed vitae ante at odio volutpat commodo. Suspendisse eget ligula in tellus efficitur scelerisque. In sollicitudin, lacus vitae convallis consequat, lorem tellus rhoncus magna, sed fermentum mi tortor eu risus. Donec elementum sem odio, vitae pretium erat egestas ut. Nulla malesuada nisl at justo vulputate accumsan. 
          </Text>
        </Layout>

        <Button
          onPress={() => {
            navigation.navigate('MyBookings')
          }}
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
          {() => <Text style={{ color: 'white', fontFamily: 'SF-UI-Display_Bold', fontSize: 18 }}>Go Back</Text>}
        </Button>

      </Layout>
    </SafeAreaView>
  );
};

export default DocumentScreen