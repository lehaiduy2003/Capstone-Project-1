import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'

const ButtonGoogle = ({
    title = "",
    onPress = () => { },
}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Image
                source={require('../assets/images/googleIcon.png')}
                style={styles.icon}
            />
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'white',
        height: hp(6.6),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl,
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        flexDirection: 'row'
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    text: {
        color: theme.colors.textDark,
        fontSize: hp(2.3),
        fontWeight: theme.fonts.semibold
    },
});

export default ButtonGoogle;