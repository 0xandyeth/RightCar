import React, { useRef } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import { SafeAreaView } from 'react-native';
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

        <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000', marginTop: '15%', marginBottom: '10%' }}>
          <Text style={{ marginBottom: '10%', textAlign: 'center' }} category="h3">
            Privacy Policy
          </Text>

          <Text style={{ textAlign: 'center', marginBottom: '20%' }} category="h6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis consectetur dignissim tellus. Fusce dapibus enim tellus, sit amet semper metus sodales vel. Sed consectetur ante quis feugiat viverra. Nunc vitae massa nec arcu pharetra blandit vitae semper magna. Mauris tincidunt, velit id scelerisque tristique, nisl nisi faucibus lectus, eget elementum turpis sapien ut turpis. Morbi eu luctus enim. Donec vel suscipit tortor. Vivamus id vestibulum nisi, a malesuada enim. 
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