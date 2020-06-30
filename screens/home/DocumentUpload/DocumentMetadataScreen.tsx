import React, { useState } from 'react';
import { Layout, Text, Input, Button, Datepicker, NativeDateService } from '@ui-kitten/components';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { TouchableWithoutFeedback, ScrollView } from 'react-native-gesture-handler';
import { GRCGDS_BACKEND } from 'react-native-dotenv'
import { Image, Alert, SafeAreaView } from 'react-native';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useRoute, RouteProp } from '@react-navigation/native';
import LoadingSpinner from '../../../partials/LoadingSpinner';
import BackButton from '../../../partials/BackButton';
import { dispatchFileState, FileTypeEnum, useDocumentState } from './DocumentState';
import { Formik } from 'formik';
import moment from 'moment';
import useAxios from 'axios-hooks'
import { useGlobalState, dispatchGlobalState } from '../../../state';

const DATE_FORMAT = 'MMM DD,YYYY'
const formatDateService = new NativeDateService('en', { format: DATE_FORMAT });

type ParamList = {
  DocumentMetadata: {
    fileType: FileTypeEnum,
    metadata: boolean,
    year: string,
    month: string,
    day: string,
    image:string
  }
}

const DocumentScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'DocumentMetadata'>>();
  const [change, triggerChange] = useState(true);
  const [dictionary] = useDocumentState("dictionary")
  const [profile] = useGlobalState('profile')

  const [getFilesReq, sendFile] = useAxios({
    url: `${GRCGDS_BACKEND}`,
    method: 'POST',
  })

  const initialValues = {
    country: '',
    expDate: moment()
  }
  if (route.params.day && route.params.month && route.params.year) {
    console.log(`${route.params.year}-${route.params.month}-${route.params.day}`)
    initialValues.expDate = moment(`${route.params.year}-${route.params.month}-${route.params.day}`, 'YYYY-MM-DD')
  }

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        triggerChange(p => !p)
      }
    }, [])
  );

  return (
    <Layout style={{ display: 'flex', flex: 1, padding: '3%' }}>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={values => {

          const data = new FormData();

          data.append("module_name", "FILE_UPLOAD");
          data.append("file", dictionary.get(route.params.fileType)?.file);
          data.append("fileType", route.params.fileType);
          data.append("expDate", values.expDate.format('YYYY-MM-DD'));

          sendFile({ data })
            .then(r => {
              console.log(r.data)
              dispatchGlobalState({ type: 'profile', state: r.data })
              Alert.alert("Success", "Data saved!")
            })
            .catch(r => console.log(r))

        }}
      >
        {({ handleChange, setFieldValue, handleSubmit, values, errors, touched }) => {
          const buttonIsDisabled = () => {
            return !dictionary.get(route.params.fileType)?.file || values.expDate.unix() != initialValues.expDate.unix() || getFilesReq.loading
          }

          return (
            <>
              <ScrollView keyboardShouldPersistTaps={"handled"} style={{ height: '100%', display: 'flex', backgroundColor: 'blue' }}>
                <Layout style={{ paddingBottom: '10%', display: 'flex', flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Layout style={{ paddingRight: '3%' }}>
                    <BackButton />
                  </Layout>
                  <Text style={{ textAlign: 'left', fontSize: 24, fontFamily: 'SF-UI-Display_Bold' }} category='s2'>
                    Upload files
                  </Text>
                </Layout>
                <Layout style={{ height: '100%', paddingBottom: '120%', alignItems: 'center'}}>
                  {dictionary.get(route.params.fileType)?.file && (
                    <>
                      <TouchableWithoutFeedback style={{ display: 'flex', alignItems: 'center' }} onPress={async () => {
                        const res = await DocumentPicker.pick({
                          type: [DocumentPicker.types.images],
                        });
                        dispatchFileState({ type: route.params.fileType, state: { file: res } })
                        triggerChange(p => !p)
                      }}>
                        {change ? <Image
                          key={Math.random().toString()}
                          style={{ width: 250, height: 250, resizeMode: 'contain' }}
                          source={{ uri: dictionary.get(route.params.fileType)?.file.uri, cache: 'reload' }}
                        /> : <Image
                            key={Math.random().toString()}
                            style={{ width: 250, height: 250, resizeMode: 'contain' }}
                            source={{ uri: dictionary.get(route.params.fileType)?.file.uri, cache: 'reload' }}
                        />}
                      </TouchableWithoutFeedback>
                      <Text style={{ textAlign: 'center', fontSize: 24, fontFamily: 'SF-UI-Display' }} category='s2'>
                        {route.params.fileType}
                      </Text>
                      {(route.params.metadata && dictionary.get(route.params.fileType)?.file) && (
                        <Datepicker
                          style={{ paddingLeft: '5%', paddingRight: '5%', width: '100%' }}
                          controlStyle={{ backgroundColor: 'white', borderRadius: 10, padding: '4%' }}
                          placeholder='Pick Date'
                          date={values.expDate?.toDate()}
                          title={(d) => moment(d)?.format(DATE_FORMAT)}
                          dateService={formatDateService}
                          onSelect={nextDate => setFieldValue("expDate", moment(nextDate))}
                          accessoryLeft={() => <EntypoIcon style={{ color: 'black' }} name="calendar" size={22} />}
                        />
                      )}
                    </>
                  )}

                  {(route.params.image) && (!dictionary.get(route.params.fileType)?.file) &&(
                    <>
                      <TouchableWithoutFeedback onPress={async () => {
                        const res = await DocumentPicker.pick({
                          type: [DocumentPicker.types.images],
                        });
                        dispatchFileState({ type: route.params.fileType, state: { file: res } })
                      }}>
                        <Image
                          key={`https://www.right-cars.com/mobileapp/docs/${profile?.passimage}`}
                          style={{ width: 180, height: 250 }}
                          source={{ uri: `https://www.right-cars.com/mobileapp/docs/${profile?.passimage}`, cache: 'reload' }}
                        />
                      </TouchableWithoutFeedback>
                      <Text style={{ textAlign: 'center', fontSize: 24, fontFamily: 'SF-UI-Display' }} category='s2'>
                        {route.params.fileType}
                      </Text>
                      <Datepicker
                        style={{ paddingLeft: '5%', paddingRight: '5%', width: '100%' }}
                        controlStyle={{ backgroundColor: 'white', borderRadius: 10, padding: '4%' }}
                        placeholder='Pick Date'
                        date={values.expDate?.toDate()}
                        title={(d) => moment(d)?.format(DATE_FORMAT)}
                        dateService={formatDateService}
                        onSelect={nextDate => setFieldValue("expDate", moment(nextDate))}
                        accessoryLeft={() => <EntypoIcon style={{ color: 'black' }} name="calendar" size={22} />}
                      />
                    </>
                  )}
                  {!dictionary.get(route.params.fileType)?.file && !route.params.image && (
                    <TouchableWithoutFeedback
                      style={{ width: '200%', height: '200%', padding: '2%', backgroundColor: 'gray', display: "flex", justifyContent: 'center', alignItems: 'center' }}
                      onPress={async () => {
                        const res = await DocumentPicker.pick({
                          type: [DocumentPicker.types.images],
                        });
                        dispatchFileState({ type: route.params.fileType, state: { file: res } })
                      }}>
                      <Layout style={{ backgroundColor: 'gray' }}>
                        <Text>Press to upload {route.params.fileType}</Text>
                      </Layout>
                    </TouchableWithoutFeedback>
                  )}
                </Layout>
              </ScrollView>

              <Layout style={{ paddingTop: '2%' }}>
                <Button
                disabled={buttonIsDisabled()}
                  onPress={(e) => {
                    handleSubmit();
                  }}
                  size="giant"
                  style={{
                    backgroundColor: buttonIsDisabled() ? '#e4e9f2': '#41d5fb',
                    borderColor: buttonIsDisabled() ? '#e4e9f2' : '#41d5fb',
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
                  {() => <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>Save</Text>}
                </Button>
              </Layout>
            </>
          )
        }}
      </Formik>
    </Layout>
  )
};

export default DocumentScreen