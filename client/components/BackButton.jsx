<<<<<<< HEAD
import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'

const BackButton = ({ size = 26, router }) => {
    return (
        <View style={styles.containerBackButton}>
            <Pressable onPress={() => router.back()} style={styles.button}>
                <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text} />
            </Pressable>
        </View>

    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: 30,
        backgroundColor: '#D1D5DB'
    },
    // containerBackButton: {
    //     backgroundColor: '#D1D5DB',
    //     height: 40,
    //     width: 40,
    //     borderRadius: 30,
    // }
=======
import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from '../assets/icons'
import { theme } from '../constants/theme'

const BackButton = ({ size = 26, router }) => {
    return (
        <Pressable onPress={() => router.back()} style={styles.button}>
            <Icon name="arrowLeft" strokeWidth={2.5} size={size} color={theme.colors.text} />
        </Pressable>
    )
}

export default BackButton

const styles = StyleSheet.create({
    button: {
        alignSelf: 'flex-start',
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: 'rgba(0,0,0,0,7)'
    }
>>>>>>> 2b80ac83a54c8608be56048f6dd3c88b50df36b3
})