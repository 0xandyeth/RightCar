import React from 'react';
import { Text} from '@ui-kitten/components';

const ErrorLabel: React.FC<{ text?: string }> = ({ text }) => (
    <Text style={{ color:'#ffa5bc' }} category='s2'>{text}</Text>
);

export default ErrorLabel