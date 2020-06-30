import { Moment } from "moment"
import { APP_ACCOUNT_TYPE, APP_ACCOUNT_ID } from 'react-native-dotenv'
import { LocationCode } from "../screens/home/createBookings/CreateBookingState"


type Params = {
  pickUpDate: Moment
  pickUpTime: Moment

  dropOffDate: Moment
  dropOffTime: Moment

  pickUpLocation: LocationCode
  dropOffLocation: LocationCode
}

export default (params: Params) => {

  return {
    "GRCGDS_VehAvailRateRQ": {
      "POS": {
        "Source": {
          "RequestorID": {
            "@Type": APP_ACCOUNT_TYPE,
            "@ID": APP_ACCOUNT_ID,
          }
        }
      },
      "VehAvailRQCore": {
        "@Status": "Available",
        "Currency": { "@Code": "EUR" },
        "@Type": ``,
        "VehRentalCore": {
          "@PickUpDate": params.pickUpDate.format(`YYYY-MM-DD`),
          "@PickUpTime": params.pickUpTime.format(`HH:mm:ss`),
          "@ReturnDate": params.dropOffDate.format(`YYYY-MM-DD`),
          "@ReturnTime": params.dropOffTime.format(`HH:mm:ss`),
          "PickUpLocation": { "@LocationCode": params.pickUpLocation.Branchid },
          "ReturnLocation": { "@LocationCode": params.dropOffLocation.Branchid }
        },
      },
      "VehAvailRQInfo": {
        "Customer": {
          "Primary": {
            "DriverType": {
              "@Age": "30"
            },
            "CitizenCountryName": {
              "@Code": "GB"
            }
          }
        },
        "TPA_Extensions": {
          "ConsumerIP": "192.168.102.14"
        }
      }
    }
  }

}