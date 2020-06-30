import React from 'react';
import MaterialIcons from 'react-native-vector-icons/Ionicons';
import { useNavigation, DrawerActions } from '@react-navigation/native';

const BackButton: React.FC<{ text?: string }> = ({ text }) => {
    const navigation = useNavigation();

    return (
        <MaterialIcons size={34} name="md-arrow-back" onPress={() => navigation.goBack()} />
    )
};

export default BackButton