import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { hp } from '../../helpers/common'
import BackButton from '../../components/BackButton'

const Cart = ({ size = 26 }) => {
    const router = useRouter();
    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <View style={styles.containerBackButton}>
                    <Pressable onPress={() => router.push('homePage')} style={styles.button}>
                        <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text} />
                    </Pressable>
                    {/* <BackButton router={router} /> */}
                </View>

                <Text style={styles.title}>My Cart</Text>

            </View>
        </ScreenWrapper>
    )
}

export default Cart

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        marginHorizontal: 20,

    },
    title: {
        fontSize: hp(3),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text
    },
    containerBackButton: {
        position: 'absolute',
        left: 0,
        backgroundColor: '#D1D5DB',
        height: 40,
        width: 40,
        borderRadius: 30,
    }

})