import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useRouter } from 'expo-router'
import { theme } from '../../constants/theme'
import { hp } from '../../helpers/common'
import BackButton from '../../components/BackButton'
import Button from '../../components/Button'
import { useRoute } from '@react-navigation/native'
import Loading from '../../components/Loading'

const ProductDetail = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const route = useRoute();
    const { imageId } = route.params;
    const [image, setImage] = useState({});
    const [error, setError] = useState(null);

    // const url = `https://fakestoreapi.com/products/img/${imageId}`
    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${imageId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setImage(data))
            .catch((error) => setError(error.message));
    }, [imageId]);
    return (
        <ScreenWrapper>
            <View style={styles.header}>
                <View style={styles.containerBackButton}>
                    <BackButton router={router} style={styles.button} />
                </View>
                <Text style={styles.title}>Product Detail</Text>
            </View>
            {image ? (
                <Image source={{ uri: image.url }} style={styles.coverImage} />
            ) : (
                <Loading />
            )}
            {/* <Image source={{ uri:  }} style={styles.coverImage} /> */}

            <View style={styles.contentContainer}>
                <Text style={styles.titleProduct}>Product name</Text>
                <Text style={styles.price}>10$</Text>
            </View>

            < Button title='Add to cart' loading={loading} onPress={() => router.push("cart")} />


        </ScreenWrapper>
    )
}

export default ProductDetail

const styles = StyleSheet.create({
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
    button: {
        alignSelf: 'flex-start',
        padding: 5,

    },
    containerBackButton: {
        position: 'absolute',
        left: 0,

    },
    coverImage: {
        width: "80%",
        height: 300,
        borderRadius: 20,
        marginVertical: 3,
        marginTop: 15,
        alignSelf: 'center'
    },
    contentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 40,
        marginVertical: 20
    },
    price: {
        fontSize: 18,
        color: "#9C9C9C",
        fontWeight: theme.fonts.regular,
    },
    titleProduct: {
        fontSize: 20,
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold,
    }
})