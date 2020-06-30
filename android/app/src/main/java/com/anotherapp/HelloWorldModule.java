package com.anotherapp;
 
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Arguments;

// Android imports
import android.Manifest;
import android.content.pm.PackageManager;
import android.bluetooth.BluetoothAdapter;
import android.util.Log;
import android.os.Bundle;
import android.app.Activity;
import android.widget.Toast;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

// Core Java imports
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.Locale;
import java.util.UUID;

// Huf Secure Mobile imports
import com.hufsm.location.mobile.LocationInterface;
import com.hufsm.secureaccess.ble.log.LoggingInterface;
import com.hufsm.tacs.mobile.TacsInterface;
import com.hufsm.tacs.mobile.TacsKeyring;
import com.hufsm.tacs.mobile.TacsUtils; // Utility class with static helper
import com.hufsm.tacs.mobile.VehicleAccessInterface;
import com.hufsm.keyholder.mobile.KeyholderInterface;
import com.hufsm.telematics.mobile.TelematicsInterface;
import com.hufsm.telematics.mobile.TelematicsInterface.TelematicsDataType;
import com.hufsm.secureaccess.api.LeaseToken;
import com.hufsm.secureaccess.api.LeaseTokenBlob;
 
public class HelloWorldModule extends ReactContextBaseJavaModule implements TacsInterface.Callback, LoggingInterface.EventLogCallback {

    private Activity mActivity = null;    
    private ReactApplicationContext currentContext;
    private TacsInterface.VehicleStatus currentStatus;
    private TacsInterface tacsInterface;
    private static final Collection<TelematicsDataType> DEFAULT_TELEMATICS_REQUEST = TelematicsDataType.buildRequest();
    /**
     * A sample UUID referencing a single access grant (see the mock keyring JSON and Huf Cloud API documentation)
     */
    private String MY_MOCK_ACCESS_GRANT_ID = "MySampleAccessGrantId";
    /**
     * A Keyring as provided by the Huf TACS Cloud API, parsed from JSON
     */
    private TacsKeyring keyring = null;
 
    public HelloWorldModule(ReactApplicationContext reactContext) {
        super(reactContext); //required by React Native
        currentContext = reactContext;
        turnOnBluetoothDevice();
    }

    @Override
    //getName is required to define the name of the module represented in JavaScript
    public String getName() { 
        return "HelloWorld";
    }

    @ReactMethod
    public void init(ReadableMap tacsLeaseTokenTable, ReadableMap leaseTokenBlob) {

        ReadableMap leaseToken = tacsLeaseTokenTable.getMap("leaseToken");

        UUID leaseIdUuid = UUID.nameUUIDFromBytes(leaseToken.getString("leaseId").getBytes());
        UUID sorcIdUuid = UUID.nameUUIDFromBytes(leaseToken.getString("sorcId").getBytes());

        LeaseToken lToken = new LeaseToken(leaseIdUuid,leaseToken.getString("sorcAccessKey"),sorcIdUuid);
        LeaseTokenBlob lTokenBlob = new LeaseTokenBlob(leaseTokenBlob.getString("sorcId"), leaseTokenBlob.getString("blob"), leaseTokenBlob.getString("blobMessageCounter"));

        keyring = TacsUtils.craftKeyring(lToken, lTokenBlob, tacsLeaseTokenTable.getString("vehicleAccessGrantId"), null, null);
        MY_MOCK_ACCESS_GRANT_ID = tacsLeaseTokenTable.getString("vehicleAccessGrantId");

        initializeBLESetUp();
    }

 
    @ReactMethod
    public void onUnlockDoorsClick() {
        mActivity = getCurrentActivity();
        tacsInterface.vehicleAccess().unlockDoors();
    }

    @ReactMethod
    public void turnOnBluetoothDevice() {

        try {

            BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
            if (mBluetoothAdapter == null) {
                Log.e("APP", "Bluetooth not supported");
                Toast.makeText(currentContext, "Bluetooth not supported", Toast.LENGTH_SHORT).show();
            } else {
                if (!mBluetoothAdapter.isEnabled()) {
                    Log.e("APP", "Bluetooth is not enabled. Enabling...");
                    mBluetoothAdapter.enable();
                    Toast.makeText(currentContext, "Bluetooth is not enabled. Enabling...", Toast.LENGTH_SHORT).show();
                }

            }
            
        } catch(Exception e) {
            Log.e("APP", e.getMessage());
        }
    }

    @Override
    public void updateVehicleStatus(final TacsInterface.VehicleStatus newStatus) {
        if (currentStatus != null && newStatus.getConnectionStatus().isConnected() && !currentStatus.getConnectionStatus().isConnected()) {

            // We just connected to the vehicle, so we might want to request some initial status information:
            tacsInterface.vehicleAccess().requestCurrentVehicleStatus(); // Initial door and immobilizer status are highly useful to have
            tacsInterface.telematics().queryTelematicsData(DEFAULT_TELEMATICS_REQUEST); // Telematics may also be useful, depending on use case
        }

        currentStatus = newStatus;

        /*
          Now we might want to display the latest status (doors, immobilizer and telematics). For telematics, we need to make the TelematicsData
          collection a bit more suitable for a UI presentation:
          */
        final Collection<TelematicsInterface.TelematicsData> td = newStatus.getTelematicsData();

        final String odometerStatus = formatTelematicsData(td, TelematicsInterface.TelematicsDataType.ODOMETER);
        final String fuelPercentStatus = formatTelematicsData(td, TelematicsInterface.TelematicsDataType.FUEL_LEVEL_PERCENTAGE);
        final String fuelAbsoluteStatus = formatTelematicsData(td, TelematicsInterface.TelematicsDataType.FUEL_LEVEL_ABSOLUTE);

        // ... where we display the latest status. This is just for show, an app might also trigger logic on certain states, of course!

        // Overall connection status
        if (newStatus.getConnectionStatus().isError()) {
            // The ConnectionStatus enum features a convenient isError() method, in case the details do not matter
            String message = newStatus.getErrorMessage();
            message = message == null || message.isEmpty() ? "No details" : message;
            WritableMap params = Arguments.createMap();
            params.putString("status", newStatus.getConnectionStatus().name() + " : " + message);
            sendEvent("VehicleStatus", params);
            Toast.makeText(currentContext, newStatus.getConnectionStatus().name() + " : " + message, Toast.LENGTH_SHORT).show();
            Log.e("APP", newStatus.getConnectionStatus().name() + " : " + message);
        } else {
            WritableMap params = Arguments.createMap();
            params.putString("status", newStatus.getConnectionStatus().name());
            sendEvent("VehicleStatus", params);
            Toast.makeText(currentContext, newStatus.getConnectionStatus().name(), Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void updateDeviceStatus(final TacsInterface.BluetoothDeviceStatus deviceStatus, final String errorMessage) {

        WritableMap params = Arguments.createMap();
                    
                    switch (deviceStatus) {

                        case DEVICE_AVAILABLE:
                            /*
                             * Everything is fine now! So, if the previous state was e.g. DEVICE_DEACTIVATED,
                             * then the BT was turned on by the user. In any case, you probably want to start
                             * a connection now or make some UI available to a user, if not already in
                             * progress.
                             */
                            params.putString("status", "DEVICE_AVAILABLE");
                            sendEvent("DeviceStatus", params);
                            Toast.makeText(currentContext, "DEVICE_AVAILABLE", Toast.LENGTH_SHORT).show();
                            break;

                        case DEVICE_QUEUE_LIMIT_REACHED:
                            /*
                             * A BLE connection can only send commands at a certain rate, due to limited bandwidth of
                             * radio connections. If your app is queueing up commands (lock, unlock, telematics ...)
                             * faster than they can be send, you will eventually get this warning from the interface,
                             * that the send queue has reached its limit.
                             * This should never be reached in any conceivable use case. Either someone really is
                             * hammering buttons until their fingers bleed or you have a serious issue in your app,
                             * like an unintentional feedback loop, which essentially causes some form of
                             *      while (somethingTruthy) { executeCommand(); }
                             * Double check your app for such patterns and ensure, that there is some de-bounce in
                             * the UI. For example, buttons could be "greyed out" or put in some "busy" UI state,
                             * which signals to a user that aggressive button use does not, in fact, speed things
                             * up or fixes any issues ;-)
                             */
                            params.putString("status", "DEVICE_QUEUE_LIMIT_REACHED");
                            sendEvent("DeviceStatus", params);
                            Toast.makeText(currentContext, "DEVICE_QUEUE_LIMIT_REACHED", Toast.LENGTH_SHORT).show();
                            break;

                        case DEVICE_NOT_SUPPORTED:
                            // fallthrough
                        case DEVICE_DEACTIVATED:
                            // fallthrough
                        case DEVICE_PERMISSION_ERROR:
                            // fallthrough
                        case DEVICE_ERROR:
                            // fallthrough
                        default:
                            /*
                              If the new status represents some error with the device, all the other data we might have received
                              previously becomes obsolete. Here we just reset the two UI labels, but more complex apps might have
                              to execute additional logic, depending on the exact device status, handling all these enum cases
                              differently if so desired.
                             */
                            //doorStatus.setText(VehicleAccessInterface.DoorStatus.DOORS_UNKNOWN.name());
                            //immoStatus.setText(VehicleAccessInterface.ImmobilizerStatus.VEHICLE_START_UNKNOWN.name());
                            params.putString("status", "default");
                            sendEvent("DeviceStatus", params);
                            Toast.makeText(currentContext, "DEFAULT", Toast.LENGTH_SHORT).show();
                            break;
                    }
    }

    private void sendEvent(String eventName, WritableMap params) {

        currentContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    /**
     * Helper method to quickly extract a TelematicsData instance from a callback response,
     * formatted for printing to log or UI.
     * Note: The timestamps received from the SDK as part of the responses are generated by the CAM,
     * not by the SDK, and thus are based on the internal clock of the CAM, not the phone clock!
     *
     * @param responses The complete set of items returned from the telematics interface
     * @param type      The desired element to extract, if present.
     * @return A formatted string with timestamp, value and unit for SUCCESS status, else an error message
     */
    private String formatTelematicsData(Collection<TelematicsInterface.TelematicsData> responses, TelematicsInterface.TelematicsDataType type) {

        for (TelematicsInterface.TelematicsData data : responses) {
            if (data.type() == type) {
                if (data.statusCode() == TelematicsInterface.TelematicsStatusCode.SUCCESS) {
                    return String.format("%s :\n%s (%s)", data.timestamp(), data.value(), data.unit());
                } else {
                    return String.format("%s :\n%s", data.timestamp(), data.statusCode().name());
                }
            }
        }
        return "Not available";
    }

    /**
     * Initialize the TACS interface with a builder.
     * 1) We select the mock mode or real BLE mode as build parameter. Switching requires a rebuild.
     * <p>
     * 2) The interface needs an Android 'Context' instance. If initialized in an activity or service, the context will be 'this'. From a
     * fragment, it will be 'getActivity()'. From an application class 'getApplicationContext()' will do. The context is needed because
     * access to the Bluetooth of the OS requires it.
     * <p>
     * 3) We need to register for a callback to receive status updates, usually this is a 'this' pointer.
     */
    private void initializeBLESetUp() {

        if (tacsInterface != null) {
            tacsInterface.closeInterface();
        }

        askBlePermissions();

        tacsInterface = new TacsInterface.Builder(this, currentContext)
                .build();
        /*
         Optionally, register an event callback if you are interested in forwarding log output and debug information +
         to e.g. third party issue trackers. For simple ADB logcat, this is not required and already performed by the SDK.
         */
        tacsInterface.logging().registerEventCallback(this);
        /*
         Optionally, additional events from the underlying Secure Access library can also be exposed by setting the
         corresponding flag via the following line (remove comment marks). Please be aware, that this is normally not
         needed and events will largely be redundant to events already generated by the TACS interface.
         */
        // tacsInterface.logging().trackSecureAccess(true);
        /*
         The following line is optional, by default the log level will remain at INFO level. See the
         LoggingInterface.LogLevel specification for the available levels.
         */
        tacsInterface.logging().setLogLevel(LoggingInterface.LogLevel.DEBUG);

        /*
         We apply the keyring and access grant ID here for convenience, since it is always the same in this app.
         You do not need to completely rebuild the interface to set a new keyring or ID however and can call the
         useAccessGrant(...) method anywhere in your code where you wish to handle selection of a new access grant,
         as long as the TACS interface has been initialized before.
         For example, you could have the user select the vehicle from a list and call useAccessGrant() upon every
         selection, while the TacsInterface is only created once in your app in the onCreate() life-cycle method.
         */
        if (tacsInterface.useAccessGrant(MY_MOCK_ACCESS_GRANT_ID, keyring)) {
            //The key ring is loaded successfully
        } else {
            //Invalid keyring
        }

        Log.e("APP", TacsInterface.ConnectionStatus.UNAVAILABLE.name());
        Log.e("APP", VehicleAccessInterface.DoorStatus.DOORS_UNKNOWN.name());
        Log.e("APP", VehicleAccessInterface.ImmobilizerStatus.VEHICLE_START_UNKNOWN.name());

        Log.e("APP", "Not connected");
        // The keyholder provides some more information, but for this demo app the status flag is sufficient to showcase the use
        Log.e("APP", KeyholderInterface.StatusCode.KEYHOLDER_NOT_DETECTED.name());
        Log.e("APP", "No data");
    }

    /**
     * On Android 6 and upwards, permissions for use of BLE needs to be requested by every app
     * at runtime. This method checks and asks in a minimal, simple way.
     * In a real app, some explanation should be provided to the end user and also cases should
     * be handled where permissions are denied or later revoked via the system menu of the phone.
     * The default Android system dialogs "Do you want app X to access Y" are not very helpful.
     * Most end users do not understand, that Bluetooth qualifies for "Location" permissions
     * and might think you want the GPS instead. Make sure to explain the choice Google made
     * to your "Average Joe" consumer.
     */
    private void askBlePermissions() {
        mActivity = getCurrentActivity();

        int permission = ContextCompat.checkSelfPermission(currentContext, Manifest.permission.ACCESS_FINE_LOCATION);
        if (permission != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                    mActivity,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},
                    0
            );
        }
    }

    @Override
    public void logEvent(LoggingInterface.LogEvent logEvent) {
        Log.e("APP", logEvent.toString());
        if (mActivity != null) {
            mActivity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Toast.makeText(currentContext, logEvent.toString(), Toast.LENGTH_LONG).show();
                }
            });
        } else {
            Log.e("APP", "mActivity is null");
        }
        /*
        Events are for logging and debug purposes only. They are already outputted to ADB logcat
        before you receive them here, so another print in the style
            Log.x(TAG, logEvent.toString());
        would be redundant for Android. You may, however, opt to forward them to data aggregators
        and 3rd party event tracking and monitoring solutions, such as Firebase, mixpanel, Google
        Analytics etc.
            myThirdPartyEventTracker.sendEvent(logEvent.id, logEvent.message ...);
        */
    }
}