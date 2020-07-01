import React, { useState, useEffect } from 'react';
import { Layout, Text, List, Button, Card } from '@ui-kitten/components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIconsIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import { SafeAreaView, Image, TouchableOpacity, Dimensions, View, TouchableWithoutFeedback } from 'react-native';
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import CarItem from '../../../partials/CarItem';
import { useCreateBookingState } from './CreateBookingState';
import { VehVendorAvail, VehRentalCore } from '../../../type/SearchVehicleResponse';
import { ScrollView } from 'react-native-gesture-handler';
import GetCategoryByAcrissCode from '../../../utils/GetCategoryByAcrissCode';

const _dataProvider = new DataProvider((r1, r2) => r1.VehID !== r2.VehID)

type ParamList = {
  CarsList: {
    cars: VehVendorAvail[];
  };
};
const DocumentScreen = () => {
  const route = useRoute<RouteProp<ParamList, 'CarsList'>>();
  const navigation = useNavigation();
  const [, setVehicle] = useCreateBookingState('vehicle')
  const [selectedIdx, setSelectedIdx] = useState(-1)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showSortModal, setShowSortModal] = useState(false)
  const [sortState, setSortState] = useState<"LowToHigh" | "HighToLow">("LowToHigh")

  const [carTransmissionOptions, setCarTransmissionOptions] = useState([])
  const [carTypeOptions, setCarTypeOptions] = useState([])
  const [carClassOptions, setCarClassOptions] = useState([])
  const [transmissionFilters, setTransmissionFilter] = useState<string[]>([])
  const [typesFiter, setTypesFilter] = useState<string[]>([])
  const [applyFilter, setApplyFilter] = useState<boolean>(false)

  const cars = route.params.cars

  const [dataToUse, setDataToUse] = useState(_dataProvider.cloneWithRows(cars));

  useEffect(() => {
    cars.unshift({ header: true, vehicle: { deeplink: 'q' } })
    const sortedCars = cars
      .sort((a, b) => {
        if (!a.TotalCharge) return 1
        if (!b.TotalCharge) return 1
        if (sortState == "LowToHigh") return parseFloat(a.TotalCharge.RateTotalAmount) - parseFloat(b.TotalCharge.RateTotalAmount)
        if (sortState == "HighToLow") return parseFloat(b.TotalCharge.RateTotalAmount) - parseFloat(a.TotalCharge.RateTotalAmount)
      });
    setDataToUse(_dataProvider.cloneWithRows(sortedCars))
    const transmissions = cars
      .filter(c => c.VehID)
      .map(c => c.Vehicle.TransmissionType);
    setCarTransmissionOptions(Array.from((new Set(transmissions)).values()))

    const categories = cars
      .filter(c => c.VehID)
      .map(c => GetCategoryByAcrissCode(c.Vehicle.VehType.VehicleCategory));
    setCarTypeOptions(Array.from((new Set(categories)).values()))
  }, [])

  useEffect(() => {
    const sortedCars = cars
      .sort((a, b) => {
        if (!a.TotalCharge) return 1
        if (!b.TotalCharge) return 1
        if (sortState == "LowToHigh") return parseFloat(a.TotalCharge.RateTotalAmount) - parseFloat(b.TotalCharge.RateTotalAmount)
        if (sortState == "HighToLow") return parseFloat(b.TotalCharge.RateTotalAmount) - parseFloat(a.TotalCharge.RateTotalAmount)
      });
    setDataToUse(_dataProvider.cloneWithRows(sortedCars))
  }, [sortState])

  useEffect(() => {
    if (applyFilter == false) return
    let carsToFilter = cars

    if (transmissionFilters.length != 0) {
      carsToFilter = carsToFilter
        .filter((a) => {
          if (!a.TotalCharge) return true
          return transmissionFilters.includes(a.Vehicle.TransmissionType);
        })
    }

    if (typesFiter.length != 0) {
      carsToFilter = carsToFilter
        .filter((a) => {
          if (!a.TotalCharge) return true
          return typesFiter.includes(GetCategoryByAcrissCode(a.Vehicle.VehType.VehicleCategory));
        })
    }

    setDataToUse(_dataProvider.cloneWithRows(carsToFilter))
    setApplyFilter(false)
  }, [applyFilter])


  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', backgroundColor: 'white' }}>
      <View style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {route.params.cars.length == 0 && (
          <>
            <Text style={{ fontSize: 28, textAlign: 'center' }}>No cars found :(</Text>
            <Text style={{ fontSize: 24, textAlign: 'center' }}>Go back and change you search params</Text>
          </>
        )}
        {route.params.cars.length != 0 && (
          <RecyclerListView
            style={{ width: '100%', backgroundColor: '#f0f2f3' }}
            layoutProvider={new LayoutProvider(
              index => {
                if (index == 0) return 'HEADER'
                return 0
              },
              (type, dim) => {
                if (type === 'HEADER') {
                  dim.width = Dimensions.get("window").width;
                  dim.height = (Dimensions.get("window").height / 100) * 25;
                } else {
                  dim.width = Dimensions.get("window").width;
                  dim.height = (Dimensions.get("window").height / 100) * 40;
                }
              }
            )}
            dataProvider={dataToUse}
            rowRenderer={(type, o: VehVendorAvail, idx) => {

              // @ts-ignore
              if (o.header) {
                return (
                  <>
                    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#41d5fb', marginBottom: '2%' }}>
                      <View style={{ padding: '3%' }}>
                        <View style={{ width: '100%' }}>
                          <Text style={{ fontSize: 18, textAlign: 'left', fontFamily: 'SF-UI-Display_Bold' }}>{route.params.searchParams.pickUpLocation.locationname}</Text>
                          <Text style={{ fontSize: 15, textAlign: 'left' }}>{route.params.searchParams.pickUpDate.format('MMM DD, h:mm')}</Text>
                        </View>

                        <View style={{ width: '100%' }}>
                          <Text style={{ fontSize: 18, textAlign: 'left', fontFamily: 'SF-UI-Display_Bold' }}>{route.params.searchParams.dropOffLocation.locationname}</Text>
                          <Text style={{ fontSize: 15, textAlign: 'left' }}>{route.params.searchParams.dropOffDate.format('MMM DD, h:mm')}</Text>
                        </View>
                      </View>
                      <TouchableWithoutFeedback onPress={() => {
                        if (navigation.canGoBack()) {
                          navigation.goBack()
                        }
                      }}>
                        <View style={{ backgroundColor: '#2f9eba', width: '15%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <MaterialIconsIcons style={{ color: 'white' }} name={"edit"} size={24} />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', width: '100%', paddingLeft: '3%', paddingRight: '3%' }}>
                      <TouchableOpacity style={{ width: '49%' }} onPress={() => setShowSortModal(true)} >
                        <View style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: '#00000050' }}>
                          <MaterialCommunityIcons style={{ alignSelf: 'flex-start', marginTop: 'auto', marginBottom: 'auto', color: 'gray' }} name={"sort-variant"} size={18} />
                          <Text style={{ fontSize: 18, textAlign: 'center', width: '50%', fontFamily: 'SF-UI-Display_Bold' }}>
                            Sort By
                        </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{ width: '49%', marginLeft: '1%' }} onPress={() => setShowFilterModal(true)}>
                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', borderWidth: 1, borderColor: '#00000050' }}>
                          <MaterialCommunityIcons style={{ alignSelf: 'flex-start', marginTop: 'auto', marginBottom: 'auto', color: 'gray' }} name={"filter"} size={18} />
                          <Text style={{ fontSize: 18, textAlign: 'center', width: '50%', fontFamily: 'SF-UI-Display_Bold' }}>
                            Filter
                        </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              }

              return (
                <CarItem key={o.VehID} vehicle={o} isActive={selectedIdx == idx} onClick={() => {
                  if (idx == selectedIdx) return setSelectedIdx(-1)
                  return setSelectedIdx(idx)
                }} />
              );
            }}

          />
        )}
      </View>
      {route.params.cars.length == 0 && (
        <Button
          onPress={() => navigation.goBack()}
          size="medium"
          style={{
            backgroundColor: '#41d5fb',
            borderColor: '#41d5fb',
            width: '80%',
            marginBottom: '5%',
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
          {() => <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>Go back</Text>}
        </Button>
      )}
      {route.params.cars.length != 0 && (
        <Button
          onPress={() => {
            setVehicle(cars[selectedIdx])
            navigation.navigate('CarExtras', { vehicle: cars[selectedIdx] })
          }}
          disabled={selectedIdx == -1 ? true : false}
          size="medium"
          style={{
            backgroundColor: selectedIdx != -1 ? '#41d5fb' : '#e4e9f2',
            borderColor: selectedIdx != -1 ? '#41d5fb' : '#e4e9f2',
            width: '80%',
            marginBottom: '5%',
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
          {() => <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>BOOK NOW</Text>}
        </Button>
      )}
      <Modal
        onBackdropPress={() => setShowSortModal(false)}
        isVisible={showSortModal}
        style={{
          marginHorizontal: 0,
          margin: 0,
        }}>
        <Layout style={{ height: '100%', padding: '3%' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: '6%' }} category="h5">Sort By</Text>
            <Text onPress={() => setShowSortModal(false)} style={{ fontFamily: 'SF-UI-Display_Bold' }} category="h3">X</Text>
          </View>
          <TouchableOpacity onPress={() => {
            setShowSortModal(false)
            setSortState("LowToHigh")
          }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: "SF-UI-Display_Bold", marginBottom: '5%' }}>
                Price Low To High
            </Text>
              {sortState == "LowToHigh" && <MaterialCommunityIcons style={{ alignSelf: 'flex-start', color: '#41d5fb' }} name={"check"} size={24} />}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setShowSortModal(false)
            setSortState("HighToLow")
          }}>
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: "SF-UI-Display_Bold", marginBottom: '5%' }}>
                Price High to Low
            </Text>
              {sortState == "HighToLow" && <MaterialCommunityIcons style={{ alignSelf: 'flex-start', color: '#41d5fb' }} name={"check"} size={24} />}
            </View>
          </TouchableOpacity>
        </Layout>
      </Modal>

      <Modal
        onBackdropPress={() => setShowFilterModal(false)}
        isVisible={showFilterModal}
        style={{
          margin: 0,
          justifyContent: 'flex-end',
        }}>
        <Layout style={{ height: '100%', padding: '3%' }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ marginBottom: '4%' }} category="h5">Filter By</Text>
            <Text onPress={() => setShowFilterModal(false)} style={{ fontFamily: 'SF-UI-Display_Bold' }} category="h3">X</Text>
          </View>
          <ScrollView>
            <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: "SF-UI-Display_Bold", marginBottom: '3%' }}>Transmission</Text>
            {carTransmissionOptions.map(i => {
              return (
                <Card
                  onPress={() => {
                    setShowSortModal(false)
                    setTransmissionFilter(p => {
                      if (p.includes(i)) {
                        return p.filter(o => o != i)
                      }

                      return [...p, i]
                    })
                  }}
                  style={{
                    marginBottom: '4%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    elevation: 2,
                  }}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ textAlign: 'left', color: '#41d5fb', fontFamily: "SF-UI-Display" }} category="h6">
                      {i}
                    </Text>
                    {transmissionFilters.includes(i) && <MaterialCommunityIcons style={{ marginLeft: '2%', color: '#41d5fb' }} name={"check"} size={24} />}
                  </View>
                </Card>
              );
            })}

            <Text style={{ fontSize: 18, color: '#33adcc', fontFamily: "SF-UI-Display_Bold", marginBottom: '3%' }}>Car Type</Text>
            {carTypeOptions.map(i => {
              return (
                <Card
                  onPress={() => {
                    setShowSortModal(false)
                    setTypesFilter(p => {
                      if (p.includes(i)) {
                        return p.filter(o => o != i)
                      }

                      return [...p, i]
                    })
                  }}
                  style={{
                    marginBottom: '4%',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    elevation: 2,
                  }}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ textAlign: 'left', color: '#41d5fb', fontFamily: "SF-UI-Display" }} category="h6">
                      {i}
                    </Text>
                    {typesFiter.includes(i) && <MaterialCommunityIcons style={{ marginLeft: '2%', color: '#41d5fb' }} name={"check"} size={24} />}
                  </View>
                </Card>
              );
            })}
          </ScrollView>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button
              onPress={(e) => {
                setShowFilterModal(false)
              }}
              size="small"
              style={{
                width: '48%',
                backgroundColor: '#41d5fb',
                borderColor: '#41d5fb',
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
              {() => {
                return (
                  <>
                    <MaterialCommunityIcons style={{ color: 'white' }} size={26} name="close" />
                    <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>Close</Text>
                  </>
                );
              }}
            </Button>
            <Button
              onPress={(e) => {
                setApplyFilter(true)
                setShowFilterModal(false)
              }}
              size="small"
              style={{
                width: '48%',
                backgroundColor: '#41d5fb',
                borderColor: '#41d5fb',
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
              {() => {
                return (
                  <>
                    <MaterialCommunityIcons style={{ color: 'white' }} size={26} name="check" />
                    <Text style={{ fontFamily: 'SF-UI-Display_Bold', color: 'white', fontSize: 18 }}>Apply</Text>
                  </>
                );
              }}
            </Button>
          </View>

        </Layout>
      </Modal>
    </SafeAreaView>
  );
};

export default DocumentScreen