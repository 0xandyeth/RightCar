import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Layout } from '@ui-kitten/components';

const MenuButton: React.FC<{ text?: string }> = ({ text }) => {
    const navigation = useNavigation();

    return (
        <MaterialIcons size={34} name="menu" onPress={() => navigation.dispatch(DrawerActions.openDrawer())} />
    )
};

export default MenuButton