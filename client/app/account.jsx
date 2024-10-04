import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import router from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'
import BackButton from '../components/BackButton'

const account = () => {
    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>


                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>My Account</Text>

                </View>
            </View>
        </ScreenWrapper>
    )
}

export default account

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical: 10,

    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    }
})