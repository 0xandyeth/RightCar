import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Icon, Layout, Spinner } from '@ui-kitten/components';


const LoadingSpinner = ({ styles }: {styles?: ViewStyle}) => (
  <View style={styles}>
    <Spinner size='small'/>
  </View>
);

export default LoadingSpinner