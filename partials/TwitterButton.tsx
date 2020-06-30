import React from 'react';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Text, Button } from '@ui-kitten/components';

const TwitterButton: React.FC<{ text?: string, onPress: () => void }> = ({ onPress }) => {
    return (
        <Button onPress={() => {
            onPress();
        }} size="small" accessoryLeft={() => <EntypoIcon style={{ color: '#ffffff', marginRight: '8%' }} name="twitter-with-circle" size={22} />} style={{ borderRadius: 10, backgroundColor: '#41d5fb', borderColor: '#41d5fb', paddingLeft: 20, paddingRight: 20 }}>
            {() => <Text style={{ color: 'white' }}>Twitter</Text>}
        </Button>
    )
};

export default TwitterButton