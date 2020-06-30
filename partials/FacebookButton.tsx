import React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Text, Button } from '@ui-kitten/components';
import { GestureResponderEvent } from 'react-native';

const FacebookButton: React.FC<{ text?: string, onPress: (event: GestureResponderEvent) => void }> = ({ text, onPress }) => {
    return (
        <Button onPress={onPress} size="small" accessoryLeft={() => <EntypoIcon style={{ color: '#ffffff', marginRight: '8%' }} name="facebook-with-circle" size={22} />} style={{ borderRadius: 10, backgroundColor: '#3b5a99', borderColor: '#3b5a99', paddingLeft: 15, paddingRight: 15 }}>
            {() => <Text style={{ color: 'white' }}>Facebook</Text>}
        </Button>
    )
};

export default FacebookButton