
import React, { useEffect } from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';
import { LoginScreenProps } from '../../types';
import DrawerMenu from './CustomeDrawer';
import NotificationScreen from './NotificationScreen';
import DocumentScreen from './DocumentUpload/DocumentScreen';
import VerifyPhoneScreen from '../VerifyPhoneScreen';
import SingleUploadScreen from './DocumentUpload/SingleUploadScreen';
import CompletedUploadScreen from './DocumentUpload/CompletedUploadScreen';
import MyTripsScreens from './MyTripsScreen';
import ActivateScreen from './ActivateScreen';
import LocalitationScreen from './Localitation';
import DamageScreen from './DamageScreen';
import NoPictureDamageScreen from './NoPictureDamageScreen';
import ReservationScreen from './bookingsDetails/ReservationScreen';
import SelectLocation from './createBookings/index';
import KeyedReservation from './bookingsDetails/KeyedReservation';
import EndRentalScreen from './EndRentalScreen';
import SignScreen from './bookingsDetails/SignScreen';
import EditProfile from './EditProfile';
import ProfileVerificationScreen from './ProfileVerificationScreen';
import { useGlobalState } from '../../state';
import userHasFullProfile from '../../utils/userHasFullProfile';
import userHasAllFiles from '../../utils/userHasAllFiles';
import { GRCGDS_BACKEND } from 'react-native-dotenv';
import useAxios from 'axios-hooks'

const Drawer = createDrawerNavigator();
export default ({ navigation }: StackScreenProps<LoginScreenProps>) => {
    const [profile] = useGlobalState('profile')
    const [{ data, loading, error }, doVerify] = useAxios({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST'
      }, { manual: true })

    const screens = [
        <Drawer.Screen name="CompletedUpload" component={CompletedUploadScreen} />,
    ]

    const hasAllFiles = userHasAllFiles(profile || {})
    const hasFullProfile = userHasFullProfile(profile || {})

    if (profile && profile.vemail == 0) screens.unshift(<Drawer.Screen name="Opt" component={VerifyPhoneScreen} />);

    screens.unshift(<Drawer.Screen name="ProfileVerification" component={ProfileVerificationScreen} />);

    if (profile && profile.mobilenumber != "" && profile.mobilecode != "" && profile.vphone != 1) {
        screens.unshift(<Drawer.Screen name="Opt" component={VerifyPhoneScreen} />);
    }

    if (hasFullProfile && hasAllFiles) {
        screens.push(
            <Drawer.Screen name="CreateBooking" component={SelectLocation} />,
            <Drawer.Screen name="Location" component={LocalitationScreen} />,
            <Drawer.Screen name="Reservation" component={ReservationScreen} />,
            <Drawer.Screen name="Damage" component={DamageScreen} />,
            <Drawer.Screen name="NoPicturDamage" component={NoPictureDamageScreen} />,
            <Drawer.Screen name="Activate" component={ActivateScreen} />,
            <Drawer.Screen name="Notifications" component={NotificationScreen} />,
            <Drawer.Screen name="EditProfile" component={EditProfile} />,
            <Drawer.Screen name="Documents" component={DocumentScreen} />,
            <Drawer.Screen name="SingleUpload" component={SingleUploadScreen} />,
            <Drawer.Screen name="Sign" component={SignScreen} />,
            <Drawer.Screen name="EndRental" component={EndRentalScreen} />,
        )
        screens.unshift(<Drawer.Screen name="MyBookings" component={MyTripsScreens} />)
    }

    useEffect(() => {
        if (profile && profile.mobilenumber != "" && profile.mobilecode != "" && profile.vphone != 1) {
            doVerify({
                data: {
                    "module_name": "RESEND_VERIFY",
                    "id": profile.id
                }
            })
            .then(r => console.log(r.data))
        }
    }, [])

    return (
        <Drawer.Navigator drawerContent={(props) => <DrawerMenu navigation={props.navigation} />} initialRouteName="Home">
            {screens.map((s) => s)}
        </Drawer.Navigator>
    )
};
