export interface BookingResponse {
    OTA_VehListRS: OTAVehListRS;
}

export interface OTAVehListRS {
    $:             Empty;
    Success:       string[];
    VehListRSCore: string[];
    VehResRSCore:  VehResRSCore[];
}

export interface Empty {
    xmlns:                string;
    "xmlns:xsi":          string;
    "xsi:schemaLocation": string;
    TimeStamp:            string;
    Target:               string;
    Version:              string;
}

export interface VehResRSCore {
    VehReservation: VehReservation[];
}

export interface VehReservation {
    Customer:       Customer[];
    VehSegmentCore: VehSegmentCore[];
}

export interface Customer {
    Primary: Primary[];
}

export interface Primary {
    PersonName: PersonName[];
    Email:      string[];
    Address:    PrimaryAddress[];
}

export interface PrimaryAddress {
    AddressLine: string[];
    CityName:    string[];
    PostalCode:  string[];
}

export interface PersonName {
    GivenName: string[];
    Surname:   string[];
}

export interface VehSegmentCore {
    ConfID:          ConfID[];
    Vendor:          Vendor[];
    VehRentalCore:   VehRentalCore[];
    LocationDetails: LocationDetail[];
}

export interface ConfID {
    Type:      string[];
    ID:        string[];
    Resnumber: string[];
    ReservationStatus: string[];
}

export interface LocationDetail {
    Address:     LocationDetailAddress[];
    Telephone:   Telephone[];
    Code:        string[];
    Name:        string[];
    CodeContext: string[];
    Pickupinst:  string[];
}

export interface LocationDetailAddress {
    AddressLine: AddressLine[];
}

export interface AddressLine {
    _:           string;
    CityName:    string[];
    PostalCode:  string[];
    CountryName: CountryName[];
}

export interface CountryName {
    Name: string[];
    Code: string[];
}

export interface Telephone {
    PhoneNumber: string[];
}

export interface VehRentalCore {
    PickUpLocation: PickUpLocation[];
    ReturnLocation: ReturnLocation[];
    PickUpDateTime: string[];
    ReturnDateTime: string[];
}

export interface PickUpLocation {
    LocationCode: string[];
    CodeContext:  string[];
}

export interface ReturnLocation {
    LocationCode: string[];
}

export interface Vendor {
    CompanyShortName: string[];
    Code:             string[];
}