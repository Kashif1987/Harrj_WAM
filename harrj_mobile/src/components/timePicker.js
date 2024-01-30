import React, { useState } from 'react'
import { Image, View } from 'react-native'
import { Button, Text } from 'react-native'
import DatePicker from 'react-native-date-picker'
import { TouchableOpacity } from 'react-native-gesture-handler'
import images from '../assets/images/images'

const TimePickerCustom = ({ mode, title }) => {
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', flex: 1 }}>
                    <Text>
                        {date.toLocaleTimeString()}
                    </Text>

                    <Image
                        style={{ height: 22, width: 22, }}
                        source={images.start_time}
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
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                    title={title}
                    androidVariant='iosClone'

                />
            </TouchableOpacity>

        </>
    )
}

export default TimePickerCustom;