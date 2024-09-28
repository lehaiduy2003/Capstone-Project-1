import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome5, FontAwesome, Feather } from '@expo/vector-icons'
import Icon from 'react-native-vector-icons/FontAwesome';
const TabBar = ({ state, descriptors, navigation }) => {
    const icons = {
        // cart: (props) => <FontAwesome name="shoppingcart" size={24} color={greyColor}{...props} />,
        // orders: (props) => <FontAwesome name="shopping-bag" size={24} color={greyColor}{...props} />,
        // home: (props) => <FontAwesome name="home" size={24} color={greyColor}{...props} />,
        // wallet: (props) => <FontAwesome name="wallet" size={24} color={greyColor}{...props} />,
        // account: (props) => <FontAwesome name="user" size={24} color={greyColor}{...props} />,
        cart: 'shopping-cart',
        orders: 'shopping-bag',
        homePage: 'home',
        wallet: 'layout',
        account: 'user',

    }
    const primaryColor = '#0891b2';
    const greyColor = '#737373';
    return (
        <View style={styles.tabbar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;
                const iconsname = icons[route.name];
                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.tabbarItem}
                    >
                        {
                            // icons[route.name]({
                            //     color: isFocused ? primaryColor : greyColor
                            // }) // this is the icon
                            // this is the icon
                        }
                        <Feather name={iconsname} size={26} color={isFocused ? primaryColor : greyColor} />
                        <Text style={{
                            color: isFocused ? primaryColor : greyColor,
                            fontSize: 11
                        }}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

const styles = StyleSheet.create({
    tabbar: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F4F6F8',
        marginHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 20,
        borderCurve: 'continuous',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
    },
    tabbarItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    }
})

export default TabBar