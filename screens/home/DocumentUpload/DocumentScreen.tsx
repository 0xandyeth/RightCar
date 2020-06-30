import React, { useState } from 'react';
import { Layout, Text, Button } from '@ui-kitten/components';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { Image, Alert } from 'react-native';
import useAxios from 'axios-hooks'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import BackButton from '../../../partials/BackButton';
import { FileTypeEnum, dispatchFileState, useDocumentState, Actions } from './DocumentState';
import { useGlobalState } from '../../../state';

const DocumentScreen = () => {
  const navigation = useNavigation();
  const [change, triggerChange] = useState(true);
  const [dictionary] = useDocumentState("dictionary")
  const [profile] = useGlobalState('profile')

  const [getFilesReq, refetch] = useAxios({
    url: `${GRCGDS_BACKEND}`,
    method: 'POST',
    data: { module_name: 'GET_FILES' }
  })

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      /*return () => {
        dispatchFileState({ type: Actions.RESET, state: {} });
      }*/
    }, [])
  );

  const fileTypes = [
    { tag: "Passport", id: FileTypeEnum.passport, color: 'gray', metadata: true },
    { tag: "Driving License", id: FileTypeEnum.driving_license, color: 'gray', metadata: true },
    { tag: "Selfi", id: FileTypeEnum.selfi, color: 'gray' },
  ]

  return (
    <Layout style={{ display: 'flex', flex: 1, padding: '3%' }}>
      <Layout style={{ paddingBottom: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
        {navigation.canGoBack() && (
          <Layout style={{ paddingRight: '3%' }}>
            <BackButton />
          </Layout>
        )}
        <Text style={{ textAlign: 'left', fontSize: 24, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
          Upload files
        </Text>
      </Layout>
      <Layout style={{ flex: 1, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {fileTypes.map((type) => {
          if (dictionary.get(type.id)?.file) {
            return (
              <TouchableWithoutFeedback onPress={async () => {
                navigation.navigate("DocumentMetadata", { fileType: type.id, metadata: type.metadata })
              }}>
                {change ? <Image
                  key={dictionary.get(type.id)?.file.uri.toString()}
                  style={{ width: 150, height: 200, resizeMode: 'cover' }}
                  source={{ uri: dictionary.get(type.id)?.file.uri.toString(), cache: 'reload' }}
                /> : <Image
                    key={dictionary.get(type.id)?.file.uri.toString()}
                    style={{ width: 150, height: 200, resizeMode: 'cover' }}
                    source={{ uri: dictionary.get(type.id)?.file.uri.toString(), cache: 'reload' }}
                  />}
              </TouchableWithoutFeedback>
            );
          }

          if (type.id == FileTypeEnum.passport && profile?.passimage) {
            return (
              <TouchableWithoutFeedback onPress={async () => {
                navigation.navigate("DocumentMetadata", {
                  fileType: type.id,
                  year: profile?.passday,
                  month: profile?.passmonth,
                  day: profile?.passday,
                  image: profile?.passimage,
                  fullUrl: `https://www.right-cars.com/uploads/pass/${profile?.passimage}`
                })
              }}>

                <Image
                  key={`https://www.right-cars.com/uploads/pass/${profile?.passimage}`}
                  style={{ width: 180, height: 250 }}
                  source={{ uri: `https://www.right-cars.com/uploads/pass/${profile?.passimage}`, cache: 'reload' }}
                />
              </TouchableWithoutFeedback>
            );
          }

          if (type.id == FileTypeEnum.driving_license && profile?.drimage) {
            return (
              <TouchableWithoutFeedback onPress={async () => {
                navigation.navigate("DocumentMetadata", {
                  fileType: type.id,
                  year: profile?.dryear,
                  month: profile?.drmonth,
                  day: profile?.drday,
                  image: profile?.drimage,
                  fullUrl: `https://www.right-cars.com/uploads/drlic/${profile?.drimage}`
                })
              }}>

                <Image
                  key={`https://www.right-cars.com/uploads/drlic/${profile?.drimage}`}
                  style={{ width: 180, height: 250 }}
                  source={{ uri: `https://www.right-cars.com/uploads/drlic/${profile?.drimage}`, cache: 'reload' }}
                />
              </TouchableWithoutFeedback>
            );
          }

          if (type.id == FileTypeEnum.selfi && profile?.selfiurl) {
            return (
              <TouchableWithoutFeedback onPress={async () => {
                navigation.navigate("DocumentMetadata", {
                  fileType: type.id,
                  image: profile?.selfiurl,
                  fullUrl: `https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}`
                })
              }}>

                <Image
                  key={`https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}`}
                  style={{ width: 180, height: 250 }}
                  source={{ uri: `https://www.right-cars.com/uploads/selfi/${profile?.selfiurl}`, cache: 'reload' }}
                />
              </TouchableWithoutFeedback>
            );
          }


          return (
            <TouchableWithoutFeedback
              style={{ width: 150, height: '65%', margin: '2%', backgroundColor: type.color, display: "flex", justifyContent: 'center', alignItems: 'center' }}
              onPress={async () => {
                navigation.navigate("DocumentMetadata", { fileType: type.id, metadata: type.metadata })
              }}>
              <Layout style={{ backgroundColor: type.color }}>
                <Text>{type.tag}</Text>
              </Layout>
            </TouchableWithoutFeedback>
          );

        })}
      </Layout>
    </Layout>
  )
};

export default DocumentScreen