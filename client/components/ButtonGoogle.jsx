// import { Pressable, StyleSheet, Text, View } from 'react-native'
// import React from 'react'
// import { theme } from '../constants/theme'
// import { hp } from '../helpers/common'
// import Loading from '../components/Loading'
// import Icon from 'react-native-vector-icons/FontAwesome';

// const ButtonGoogle = ({
//     icon,
//     buttonStyle,
//     textStyle,
//     title = "",
//     onPress = () => { },
//     loading = false,
//     hasShadow = true,
// }) => {
//     const shadowStyle = {
//         shadowColor: theme.colors.dark,
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.2,
//         shadowRadius: 8,
//         elevation: 4
//     }

//     if (loading) {
//         return (
//             <View style={[styles.button, buttonStyle, { backgroundColor: 'white' }]}>
//                 <Loading />
//             </View>
//         )
//     }
//     return (
//         <Pressable onPress={onPress} style={[styles.button, buttonStyle, hasShadow && shadowStyle]}>
//             <Icon name='google' size={hp(5)} color="#DB4437" />
//             <Text style={[styles.text, textStyle]}>{title}</Text>
//         </Pressable>
//     );
// };

// export default ButtonGoogle

// const styles = StyleSheet.create({
//     button: {
//         backgroundColor: 'white',
//         height: hp(6.6),
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderCurve: 'continuous',
//         borderRadius: theme.radius.xl,
//         borderWidth: 0.4,
//         borderColor: theme.colors.text,
//         flexDirection: 'row'
//     },
//     text: {
//         color: theme.colors.textDark,
//         fontSize: hp(2.5),
//         fontWeight: theme.fonts.semibold
//     }
// })

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