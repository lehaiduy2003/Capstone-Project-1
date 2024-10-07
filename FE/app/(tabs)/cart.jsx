import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import router from 'expo-router'
import ScreenWrapper from '../../components/ScreenWrapper'
import BackButton from '../../components/BackButton'

const cart = () => {
    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>


                {/* Header */}
                <View>
                    <BackButton router={router} />
                    <Text style={styles.welcomeText}>Hey!</Text>
                    <Text style={styles.welcomeText}>Cart</Text>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default cart

const styles = StyleSheet.create({})