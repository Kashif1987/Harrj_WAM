import { AsyncStorage } from "react-native"

export const setLng = (data) => {
    data = JSON.stringify(data)
    return AsyncStorage.setItem('language', data)
}

export const getLng = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem('language').then(data => {
            resolve(JSON.parse(data))
        })
    })
}