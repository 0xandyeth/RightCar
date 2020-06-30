import React, { useEffect } from 'react';
import { Layout, Text, Button, Input } from '@ui-kitten/components';
import { SafeAreaView, ScrollView, Image, TextInput, View } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import TripCard from '../../partials/TripCard';
import { useRoute } from '@react-navigation/native';

const DocumentScreen = () => {
  const route = useRoute();
  const [picture, setPicture] = React.useState<string | null>(null);

  const options = {
    title: 'Select Avatar',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  useEffect(() => {
    return () => setPicture(null)
  },[])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: '20%', flexGrow: 1,display: 'flex' ,backgroundColor: '#f7f9fc' }}>
        <View style={{ padding: '5%', backgroundColor: '#f7f9fc' }}>
          <TripCard
            {...route.params}
          />

          <Layout style={{ height: '30%',display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000000' }}>
            <Text style={{ color: '#d0021b', textAlign: 'center' }} category="h2">
              PLEASE TAKE PICTURES OF ANY DAMAGE TO THE VEHICLE
            </Text>
            <Button onPress={() => {
              ImagePicker.showImagePicker(options, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                  console.log('User cancelled image picker');
                } else if (response.error) {
                  console.log('ImagePicker Error: ', response.error);
                } else if (response.customButton) {
                  console.log('User tapped custom button: ', response.customButton);
                } else {
                  setPicture(response.uri)
                }
              });
            }} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '25%', backgroundColor: 'gray', borderColor: 'gray' }}>
              {() => <Text style={{ color: 'white' }}>TAKE PICTURE</Text>}
            </Button>
          </Layout>

          <View style={{ display: 'flex', alignItems: 'center'}}>
            {picture && <Image source={{ uri: picture }} style={{ width: 200, height: 200 }} />}
          </View>

          <Layout style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#00000000' }}>
            <Text category="h4"> DESCRIPTION OF DAMAGE</Text>
            <Input
              multiline={true}
              numberOfLines = {10}
            />
          </Layout>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default DocumentScreen