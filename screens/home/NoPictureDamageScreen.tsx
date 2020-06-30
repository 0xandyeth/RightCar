import React, { useEffect } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import TripCard from '../../partials/TripCard';
import { useRoute, useNavigation } from '@react-navigation/native';

const DocumentScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  useEffect(() => {
    return () => setSubmitted(false)
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, display: 'flex', backgroundColor: '#f7f9fc' }} keyboardShouldPersistTaps={"handled"}>
        <View style={{ padding: '5%', backgroundColor: '#f7f9fc' }}>
          <TripCard
            displayPreview={true}
            {...route.params}
          />

          <Layout style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#00000000' }}>
            <Text style={{ textAlign: 'left' }} category="h6">Details of the problem</Text>
            {submitted == false && (
              <Input
                numberOfLines = {10}
                multiline
                ={true}
              />
            )}
            {submitted == true && (
              <Text style={{ textAlign: 'center', fontFamily: 'SF-UI-Display_Bold'}} category="h5">The problem with the vehicle have been recorded and the local branch will make arragementsas required</Text>
            )}
          </Layout>

          {submitted == false && (
            <Button onPress={() => setSubmitted(true)} size="giant" style={{ borderRadius: 10, backgroundColor: '#5ac8fa', borderColor: '#5ac8fa', paddingLeft: 20, paddingRight: 20, marginBottom: '2%' }}>
              {() => <Text style={{ color: 'white' }}>SUBMIT PROBLEMS DETAILS</Text>}
            </Button>
          )}

          {submitted == true && (
            <Button onPress={() => navigation.navigate('KeyedCarReservation', { ...route.params })} size="giant" style={{ borderRadius: 10, backgroundColor: '#5ac8fa', borderColor: '#5ac8fa', paddingLeft: 20, paddingRight: 20, marginBottom: '2%' }}>
              {() => <Text style={{ color: 'white' }}>Continue</Text>}
            </Button>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentScreen