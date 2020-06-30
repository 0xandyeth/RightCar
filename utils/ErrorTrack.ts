import { setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import { axiosInstance } from './AxiosBootstrap';
import { GRCGDS_BACKEND } from 'react-native-dotenv';

// registering the error handler (maybe u can do this in the index.android.js or index.ios.js)
setJSExceptionHandler((error, isFatal) => {
    // This is your custom global error handler
    // You do stuff like show an error dialog
    // or hit google analytics to track crashes
    // or hit a custom api to inform the dev team.
    axiosInstance({
        url: GRCGDS_BACKEND,
        method: 'POST',
        data: {
            module_name: 'ERROR_TRACK',
            errorMessage: `${error.message}\n${error.stack}`,
        }
    })
});

setNativeExceptionHandler(exceptionString => {
    // This is your custom global error handler
    // You do stuff likehit google analytics to track crashes.
    // or hit a custom api to inform the dev team.
    //NOTE: alert or showing any UI change via JS
    //WILL NOT WORK in case of NATIVE ERRORS.
    axiosInstance({
        url: GRCGDS_BACKEND,
        method: 'POST',
        data: {
            module_name: 'ERROR_TRACK',
            errorMessage: exceptionString,
        }
    })
});
