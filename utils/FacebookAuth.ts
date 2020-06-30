import { LoginResult, GraphRequest, GraphRequestManager, AccessToken } from "react-native-fbsdk"

import { dispatchGlobalState } from "../state"
import { GRCGDS_BACKEND } from "react-native-dotenv"
import { axiosInstance } from "./AxiosBootstrap"

export const handlePermissionPromt = (result: LoginResult) => {
    if (result.isCancelled) {
        throw new Error("Login cancelled");
    }
    //@ts-ignore
    if (result.declinedPermissions && Array.isArray(result.declinedPermissions) && result.declinedPermissions.includes("email")) {
        dispatchGlobalState({ type: 'error', state: 'You must authorize the use of email' })
        throw new Error('You must authorize the use of email')
    }

    return result
}

export const handleUserData = async (response: LoginResult) => {
    const access = await AccessToken.getCurrentAccessToken()
    return axiosInstance({
        url: `${GRCGDS_BACKEND}`,
        method: 'POST',
        data: {token: access.accessToken, module_name: 'LOGIN_WITH_FACEBOOK'}
    })
        .then((res) => {
            dispatchGlobalState({ type: 'token', state: res.data.token })
            dispatchGlobalState({ type: 'profile', state: res.data })
            return res.data;
        })
}