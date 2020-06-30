export interface VehicleResponse {
    VehAvailRSCore: VehAvailRSCore;
}

export interface VehAvailRSCore {
    VehRentalCore:   VehRentalCore;
    VehVendorAvails: VehVendorAvail[];
}

export interface VehRentalCore {
    PickUpDateTime: string;
    ReturnDateTime: string;
    LocationCode:   string;
    ReturnLocation: string;
}

export interface VehVendorAvail {
    Status:        Status;
    VehID:         string;
    Vehicle:       Vehicle;
    RentalRate:    RentalRate;
    VehicleCharge: VehicleCharge;
    TotalCharge:   TotalCharge;
    PricedEquips:  PricedEquip[];
}

export interface PricedEquip {
    Equipment: Equipment;
    Charge:    Charge;
}

export interface Charge {
    Taxamount:             Taxamount;
    Calculation:           Calculation;
    Amount:                string;
    TaxInclusive:          string;
    IncludedRate:          string;
    IncludedInEstTotalInd: string;
}

export interface Calculation {
    UnitCharge:    string;
    UnitName:      UnitName;
    Quantity:      string;
    TaxInclusive?: TaxInclusive;
    taxInclusive?: string;
}

export enum TaxInclusive {
    True = "True",
}

export enum UnitName {
    Day = "Day",
}

export interface Taxamount {
    Total:        string;
    CurrencyCode: CurrencyCode;
    Percentage:   string;
    Description?: TaxAmountDescription;
}

export enum CurrencyCode {
    Eur = "EUR",
}

export enum TaxAmountDescription {
    Tax = "Tax",
}

export interface Equipment {
    Description:   EquipmentDescription;
    EquipType:     string;
    vendorEquipID: VendorEquipID;
}

export enum EquipmentDescription {
    AdditionalDriver = "ADDITIONAL DRIVER",
    BabySeat14Years = "BABY SEAT  1-4 YEARS",
    BoosterSeat = "BOOSTER SEAT",
    ChildSeat4Years = "CHILD SEAT - 4+ YEARS",
    Gps = "GPS",
    InfantSeat = "INFANT SEAT",
    Wifi = "WIFI",
}

export enum VendorEquipID {
    Addr = "ADDR",
    Aps = "APS",
    Boseat = "BOSEAT",
    Bseat = "BSEAT",
    Cbf = "CBF",
    Cdw = "CDW",
    Cseat = "CSEAT",
    Gps = "GPS",
    Iseat = "ISEAT",
    Lst = "LST",
    Pli = "PLI",
    Scdw = "SCDW",
    Styre = "STYRE",
    Tpi = "TPI",
    Twi = "TWI",
    Ulm = "ULM",
    Unique111 = "Unique111",
    Unique232 = "Unique232",
    Wifi = "WIFI",
    Ydf = "YDF",
    Yyy = "YYY",
}

export interface RentalRate {
    RateDistance:  RateDistance;
    RateQualifier: RateQualifierClass;
}

export interface RateDistance {
    Unlimited:         string;
    DistUnitName:      DistUnitName;
    VehiclePeriodName: VehiclePeriodName;
}

export enum DistUnitName {
    KM = "Km",
}

export enum VehiclePeriodName {
    RentalPeriod = "RentalPeriod",
}

export interface RateQualifierClass {
    RateCategory:  string;
    RateQualifier: RateQualifierEnum;
    RatePeriod:    RatePeriod;
    VendorRateID:  string;
}

export enum RatePeriod {
    Daily = "Daily",
}

export enum RateQualifierEnum {
    Best = "Best",
}

export enum Status {
    Available = "Available",
}

export interface TotalCharge {
    RateTotalAmount: string;
    CurrencyCode:    CurrencyCode;
    taxInclusive:    string;
}

export interface Vehicle {
    AirConditionInd:  AirConditionInd;
    TransmissionType: TransmissionType;
    VehMakeModel:     VehMakeModel;
    VehType:          VehType;
    VehClass:         VehClass;
    VehTerms:         VehTerms;
}

export enum AirConditionInd {
    Empty = "",
    No = "No",
    Yes = "Yes",
}

export enum TransmissionType {
    Automatic = "Automatic",
    Manual = "Manual",
}

export interface VehClass {
    Size: string;
}

export interface VehMakeModel {
    Name:       string;
    PictureURL: string;
}

export interface VehTerms {
    Included:    Included[];
    NotIncluded: Included[];
}

export interface Included {
    code:       VendorEquipID;
    header:     Header;
    price:      string;
    excess?:    Excess;
    details?:   string;
    mandatory?: AirConditionInd;
    limit?:     Limit;
}

export enum Excess {
    Empty = "",
    The000 = "0.00",
    The100000 = "1000.00",
    The110000 = "1100.00",
    The130000 = "1300.00",
    The140000 = "1400.00",
    The150000 = "1500.00",
    The200000 = "2000.00",
    The250000 = "2500.00",
    The450000 = "4500.00",
    The80000 = "800.00",
}

export enum Header {
    AdditionalDriver = "Additional Driver",
    BabySeat = "Baby Seat",
    BoosterSeat = "Booster Seat",
    ChildSeat = "Child Seat",
    CollisionDamageWaiver = "Collision Damage Waiver",
    CrossBorderFees = "Cross Border   Fees",
    Gps = "GPS",
    HeaderYoungSeniorDriversFee = "Young / Senior Drivers Fee",
    InfantSeat = "Infant Seat",
    IslandFerryFee = "Island ferry fee",
    LocalTaxes = "Local Taxes",
    LocationSurcharge = "Location Surcharge",
    OutOfHoursFee = "Out of Hours Fee",
    PublicLiabilityInsurance = "Public Liability Insurance ",
    Styre = "STYRE",
    SuperCollisionDamageWaiver = "Super Collision Damage Waiver",
    TheftWaiverInsurance = "Theft Waiver Insurance",
    ThirdPartyInsurance = "Third Party Insurance",
    UnlimitedMileage = "Unlimited Mileage",
    Wifi = "WIFI",
    YoungSeniorDriversFee = "Young / Senior Drivers Fee ",
}

export enum Limit {
    Empty = "",
    The000 = "0.00",
    The40000000 = "400000.00",
}

export interface VehType {
    VehicleCategory: string;
    DoorCount:       string;
    Baggage:         string;
}

export interface VehicleCharge {
    Amount:        string;
    CurrencyCode:  CurrencyCode;
    TaxInclusive:  string;
    GuaranteedInd: string;
    Purpose:       string;
    TaxAmount:     Taxamount;
    Calculation:   Calculation;
}
