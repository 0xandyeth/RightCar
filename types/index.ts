import { FileTypeEnum } from "../screens/home/DocumentUpload/DocumentState"

export type NonLoginScreenProps = {
    Login: undefined,
    Signup: undefined,
    Opt: undefined,
    ForgotPassword: undefined,
    TwitterLogin:undefined,
}

export type LoginScreenProps = {
    Home: undefined,
    MyBookings: undefined,
    Notifications: undefined,
    Profile: undefined,
    Documents: undefined,    
    DocumentMetadata: undefined,
    EmptyLoading: undefined,
    SingleUpload: {
        fileType: FileTypeEnum,
        fileToShow?: string,
        day?: string,
        month?: string,
        year?: string,
        docNumber?: string,
        docCountry?: string,
    }
    CompletedUpload: undefined
}

export type GrcgdsLocation = {
    "id": number,
    "internalcode": string,
    "locationname": string,
    "locationvariation": string,
    "country": string
}