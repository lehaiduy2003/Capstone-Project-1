import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { theme } from '../constants/theme'
import ArtDesign from 'react-native-vector-icons/AntDesign'

const ProductCard = ({ item, isLiked, setIsLiked }) => {

    // fetch data products

    useEffect(() => {
        getProducts();
    }, []);
    const getProducts = async () => {
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
    }

    // const [isLiked, setIsLiked] = React.useState(false)
    return (
        <View style={styles.container}>
            <View>
                <Image source={{ uri: item.image }}
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





        </View>
    )
}

