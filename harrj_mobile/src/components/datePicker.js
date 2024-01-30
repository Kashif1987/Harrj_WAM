import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { Button, Text, TouchableOpacity } from 'react-native'
import DatePicker from 'react-native-date-picker'
import images from '../assets/images/images'

const DatePickerCustom = ({ mode, title }) => {
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)

    return (
        <>
            <TouchableOpacity
                style={{
                    flexDirection: 'row', width: 160,
                    borderRadius: 80, borderWidth: 1, alignSelf: 'center',
                    borderColor: '#2D2C71', height: 50,
                    justifyContent: 'center', alignItems: 'center'
                }}
                onPress={() => setOpen(true)}
            >
                <View style={{
                    flex: 1, justifyContent: 'space-around', flexDirection: 'row'
                }}>
                    <Text>
                        {date.toDateString()}
                    </Text>
                    <Image
                        style={{ height: 20, width: 20, }}
                        source={images.calendar}
                    />
                </View>
                <DatePicker
                    modal
                    open={open}
                    mode={mode}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        console.log(date.toDateString())
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                    title={title}
                    androidVariant='iosClone'
                    minimumDate={new Date()}
                />
            </TouchableOpacity>
        </>
    )
}

export default DatePickerCustom;