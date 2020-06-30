import React, { useState, useEffect } from 'react';
import { Text, CheckBox, Layout } from '@ui-kitten/components';
import { ViewStyle, View, TextStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export type TimeCheckboxProps = {
    title: string
    subTitle?: string
    style?: ViewStyle
    defaultChecked?: boolean
    checked?: boolean
    nonEditable?: boolean
    onChange: (v: boolean) => void
    onClick?: () => void
    accessoryRight?: (props: { style: TextStyle}) => React.ReactNode;
    replaceCheckbox?: (props?: { style: TextStyle}) => React.ReactNode;
}

const TimeCheckbox: React.FC<TimeCheckboxProps> = ({ title, nonEditable, replaceCheckbox, onClick,subTitle, style, onChange, defaultChecked, checked: forceChecked, accessoryRight: AccessoryRight }) => {
    const [checked, setChecked] = useState(false);
    const styles = {
        color: '#EEF1F5',
        textColor: '#222B45',
        backgroundColor: '#F7F8FA50'
    }

    if (checked) {
        styles.color = '#41D5FB'
        styles.textColor = '#41D5FB'
        styles.backgroundColor = 'white'
    }

    useEffect(() => {
        if (forceChecked !== undefined) setChecked(forceChecked)
    }, [forceChecked])

    useEffect(() => {
        if (defaultChecked !== undefined) setChecked(defaultChecked)
    }, [])
    const Node = AccessoryRight ? AccessoryRight({ style: { color: styles.textColor} }): null
    const Replace = replaceCheckbox ? replaceCheckbox() : null
    return (
        <TouchableWithoutFeedback onPress={() => {
            onClick && onClick()
            if (nonEditable === true) return
            setChecked(p => {
                onChange && onChange(!p)
                return !p
            })
        }} style={{ ...style, backgroundColor: styles.backgroundColor, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderWidth: 1, padding: '3%', borderRadius: 10, borderColor: styles.color }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                {Node}
                <Layout style={{ backgroundColor: '#00000000' }}>
                    <Text style={{ color: styles.textColor, fontFamily: 'SF-UI-Display_Bold' }}>{title}</Text>
                    {subTitle && <Text style={{ color: styles.textColor }}>{subTitle}</Text>}
                </Layout>
            </View>
            {Replace ? Replace: <CheckBox checked={checked} />}
        </TouchableWithoutFeedback>
    )
};

export default TimeCheckbox