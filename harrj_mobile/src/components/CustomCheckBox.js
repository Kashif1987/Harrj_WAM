import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'


import { TouchableOpacity, Text, StyleSheet } from 'react-native'

const CustomCheckBox = ({
    selected, onPress, style, textStyle, size = 30, text = '', ...props }) => (
    <TouchableOpacity style={[styles.checkBox, style]} onPress={onPress} {...props}>
        <Icon
            size={size}
            // color={color}
            name={selected ? 'check-box' : 'check-box-outline-blank'}
        />

        <Text style={textStyle}> {text} </Text>
    </TouchableOpacity>
)

const styles = StyleSheet.create({
    checkBox: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default CustomCheckBox

