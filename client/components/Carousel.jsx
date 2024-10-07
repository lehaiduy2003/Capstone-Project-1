import { View, Text, FlatList, Dimensions, Image, StyleSheet } from 'react-native'
import React from 'react'

const Carousel = () => {

    const screenWidth = Dimensions.get('window');
    const carouselData = [
        {
            id: "1",
            image: require('../assets/images/Carousel/images1.jpg'),
        },
        {
            id: "2",
            image: require('../assets/images/Carousel/images2.jpg'),
        },
        {
            id: "3",
            image: require('../assets/images/Carousel/images3.jpg'),
        },
        {
            id: "4",
            image: require('../assets/images/Carousel/images4.jpg'),
        },
        {
            id: "5",
            image: require('../assets/images/Carousel/image5.jpg'),
        }
    ];

    // Display Images
    const renderItem = ({ item, index }) => {
        return (
            <Carousel>
                <Image source={item.image}
                    style={{ width: screenWidth, height: 200 }} />
            </Carousel>
        )
    };
    return (
        <View>
            <Text>Carousel</Text>
            <FlatList
                data={carouselData}
                renderItem={renderItem}
                showsHorizontalScrollIndicator={false}
                horizontal
            />
        </View>
    )
}

export default Carousel

const styles = StyleSheet.create({

})