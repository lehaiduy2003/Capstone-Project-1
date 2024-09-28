import { StyleSheet, Text, View, TextInput } from 'react-native'
import React from 'react'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'

const Input = (props) => {
    return (
        <View style={[styles.container, props.containerStyles && props.containerStyles]}>
            {
                props.icon && props.icon
            }
            <TextInput
                style={{ flex: 1 }}
                placeholderTextColor={theme.colors.textLight}
                ref={props.inputRef && props.inputRef}
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: hp(7.2),
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: '#F4F6F8',
        borderRadius: theme.radius.xl,
        borderCurve: 'continuous',
        paddingHorizontal: 18,
        gap: 12,
        backgroundColor: '#F4F6F8',
        marginRight: 10,
    }
})