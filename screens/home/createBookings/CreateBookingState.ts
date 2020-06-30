import { createGlobalState } from 'react-hooks-global-state';
import { PricedEquip, VehVendorAvail } from '../../../types/SearchVehicleResponse';
import moment from 'moment';

export type LocationCode = {
    Branchid: string,
    Branchname: string,
}

type InitialState = {
    originLocation: LocationCode | null,
    returnLocation: LocationCode | null,
    inmediatePickup: boolean | null,
    departureTime: Date,
    returnTime: Date,

    arrivalTime: '',
    reservationNumber: string | null,

    extras: (PricedEquip & { amount: number }) []

    vehicle: VehVendorAvail | null
};
 
const initialState: InitialState = {
    originLocation: null,
    returnLocation: null,
    inmediatePickup: null,
    reservationNumber: null,
    departureTime: moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0}).toDate(),
    returnTime: moment().set({ hour: 10, minutes: 30, second: 0, millisecond: 0}).toDate(),
    extras: [],
    vehicle: null,
    arrivalTime: '',
};

export const { useGlobalState: useCreateBookingState } = createGlobalState<InitialState>(initialState);