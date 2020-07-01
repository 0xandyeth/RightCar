import React, { useState, useEffect } from 'react';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import { Layout, List, Text, Toggle } from '@ui-kitten/components';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback, AsyncStorage, TouchableOpacity } from 'react-native';
//@ts-ignore
import Autocomplete from 'react-native-autocomplete-input';
import FuzzySearch from 'fuzzy-search';
import { GrcgdsLocation } from '../types';
import MenuButton from './MenuButton';

export type LocationSearchInputProps = {
  pickupLocation?: { [k: string]: any } | null
  returnLocation?: { [k: string]: any } | null

  onOriginLocationSelected: (location: any) => void
  onReturnLocationSelected: (location: any) => void
}
const LocationSearchInput: React.FC<LocationSearchInputProps> = (props) => {
  const [searchingFor, setSearchingFor] = useState<"ORIGIN" | "RETURN">("ORIGIN");
  const [locations, setLocations] = useState<GrcgdsLocation[]>([]);
  const [results, setResults] = useState<GrcgdsLocation[] | null>(null);
  const [returnSameLocation, setReturnSameLocation] = useState<boolean>(true);
  const [value, setValue] = useState(null);

  const [originLocation, setOrigin] = useState<GrcgdsLocation | null>(null);
  const [returnLocation, setReturn] = useState<GrcgdsLocation | null>(null);


  useEffect(() => {
    AsyncStorage.getItem('locationsData')
      .then(stringData => {
        if (!stringData) return
        try {
          const jsonData = JSON.parse(stringData)
          setLocations(jsonData);
        } catch (error) {
          console.log('We could not parse the string location data: ' + error.toString());
        }
      })
  }, [])

  return (
    <>
      <Layout style={{ display: 'flex', flexDirection: 'row' }}>
        <MenuButton />

        {returnSameLocation && (
          <Layout style={{ marginLeft: '2%',display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <FontAwesomeIcon size={15} style={{ color: '#41d5fb' }} name="circle" />
          </Layout>
        )}

        {!returnSameLocation && (
          <Layout style={{ marginLeft: '2%',display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
            <FontAwesomeIcon size={15} style={{ color: '#41d5fb' }} name="circle" />
            <Layout style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon style={{ marginBottom: '5%' }} size={4} name="rectangle" />
              <MaterialCommunityIcon size={4} name="rectangle" />
            </Layout>
            <FontAwesomeIcon size={15} name="square" />
          </Layout>
        )}
        <Layout style={{ display: 'flex', flexDirection: 'column', width: '85%', marginLeft: '1%' }}>
          <Autocomplete
            style={{ fontFamily: 'SF-UI-Display_Bold', fontSize: 16, width: '100%', borderColor: 'white', borderBottomColor: '#E4E9F2', borderBottomWidth: 1 }}
            containerStyle={{ width: '100%' }}
            inputContainerStyle={{ width: '100%', borderColor: 'white', borderBottomColor: 'black', borderBottomWidth: 1 }}
            listStyle={{ borderColor: 'white' }}
            placeholder="Enter Origin"
            data={!results ? [] : results}
            defaultValue={originLocation?.locationname}
            onChangeText={text => {
              const searcher = new FuzzySearch(locations, ['internalcode', 'locationname', "locationvariation"]);
              const result = searcher.search(text)
              setResults(result)
              // props.onResultChange(result, "ORIGIN")
              setSearchingFor("ORIGIN")
            }}
            renderItem={({ item, i }) => (
              <TouchableOpacity onPress={() => {
                props.onOriginLocationSelected(item)
                setOrigin(item)
                setResults(null)
              }}>
                <Layout style={{ display: 'flex', flexDirection: 'row', borderBottomColor: '#E4E9F2', borderBottomWidth: 1, paddingBottom: '3%', paddingTop: '3%' }}>
                  <EvilIcon style={{ color: '#41D5FB' }} name="location" size={32} />
                  <Text style={{ fontSize: 18 }}>{item.locationname}</Text>
                </Layout>
              </TouchableOpacity>
            )}
          />
          {!returnSameLocation && (
            <Autocomplete
              style={{ fontFamily: 'SF-UI-Display_Bold', fontSize: 16, width: '100%', borderColor: 'white', borderBottomColor: '#E4E9F2', borderBottomWidth: 1 }}
              containerStyle={{ width: '100%' }}
              inputContainerStyle={{ width: '100%', borderColor: 'white', borderBottomColor: 'black', borderBottomWidth: 1 }}
              listStyle={{ borderColor: 'white' }}
              placeholder="Enter Destination"
              data={!results ? [] : results}
              defaultValue={returnLocation?.locationname}
              onChangeText={text => {
                const searcher = new FuzzySearch(locations, ['internalcode', 'locationname', "locationvariation"]);
                const result = searcher.search(text)
                setResults(result)
                // props.onResultChange(result, "ORIGIN")
                setSearchingFor("ORIGIN")
              }}
              renderItem={({ item, i }) => (
                <TouchableOpacity onPress={() => {
                  props.onReturnLocationSelected(item)
                  setReturn(item)
                  setResults(null)
                }}>
                  <Layout style={{ display: 'flex', flexDirection: 'row', borderBottomColor: '#E4E9F2', borderBottomWidth: 1, paddingBottom: '3%', paddingTop: '3%' }}>
                    <EvilIcon style={{ color: '#41D5FB' }} name="location" size={32} />
                    <Text style={{ fontSize: 18 }}>{item.locationname}</Text>
                  </Layout>
                </TouchableOpacity>
              )}
            />
          )}
        </Layout>
      </Layout>
      <Toggle checked={returnSameLocation} style={{ alignSelf: 'flex-start', marginTop: '3%', marginBottom: '3%' }} onChange={() => setReturnSameLocation(p => !p)}>
        Return car on same location
      </Toggle>
    </>
  );
}

export default LocationSearchInput