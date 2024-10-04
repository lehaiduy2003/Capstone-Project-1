import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { theme } from '../constants/theme'
import ArtDesign from 'react-native-vector-icons/AntDesign'

const ProductCard = () => {

    const [isLiked, setIsLiked] = React.useState(false)
    return (
        <View style={styles.container}>
            <Image source={require('../assets/images/products/laptop2.jpg')}
                style={styles.convertImage} />
            <View style={styles.content}>
                <Text style={styles.title}>Product name</Text>
                <Text style={styles.price}>10$</Text>
            </View>

            <TouchableOpacity onPress={() => { setIsLiked(!isLiked) }}
                style={styles.likeContainer}>
                {isLiked ? (<ArtDesign name='heart' size={20} color={"#E55B5B"} />) : (<ArtDesign name='hearto' size={20} color={"#E55B5B"} />)}
            </TouchableOpacity>
        </View>
    )
}

export default ProductCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
    },
    convertImage: {
        width: "90%",
        height: 200,
        borderRadius: 20,
        marginVertical: 3,
        marginLeft: 10,
        marginTop: 15
    },
    title: {
        fontSize: 20,
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold,
    },
    price: {
        fontSize: 18,
        color: "#9C9C9C",
        fontWeight: theme.fonts.regular,
    },
    content: {
        paddingLeft: 15,
    },
    likeContainer: {
        position: 'absolute',
        right: 10,
        top: 20,
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 34,
        width: 34,
        alignItems: 'center',
        borderRadius: 17,
    }
})