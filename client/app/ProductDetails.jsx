import { Image, 
    Pressable, 
    StatusBar, 
    StyleSheet, 
    Text, 
    View,
    TouchableOpacity,
    ScrollView,
    auto
  } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import Button from '../components/Button'
import { wp } from '../helpers/common'
import { hp } from '../helpers/common'
import ArtDesign from 'react-native-vector-icons/AntDesign'
import { router } from "expo-router";
import Carousel from '../components/Carousel'
import { theme } from "../constants/theme";

const ProductDetails = () => {
    const [isLiked, setIsLiked] = React.useState(false)
    const [follow, setfollow] = React.useState(false)
    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <ScrollView style={styles.container}>
                <View style={styles.carousel}>
                    <Image source={require('../assets/images/products/laptop2.jpg')}/>
                </View>
                <View>
                    <Text style={styles.nameproduct}>Máy tính laptop hàng chính hãng (DELL-HP) Ram 8GB Core i5 - i7 ổ SSD 256GB màn 12.5", 14",15.6 inch</Text>
                </View>
                <View style={styles.pricelove}>
                    <Text style={styles.price}>1.000.000₫</Text>
                    <TouchableOpacity onPress={() => { setIsLiked(!isLiked) }}
                        style={styles.likeContainer}>
                        {isLiked ? (<ArtDesign name='heart' size={20} color={"#E55B5B"} />) : (<ArtDesign name='hearto' size={20} color={"#E55B5B"} />)}
                    </TouchableOpacity>
                </View>
                <View style={styles.informationshop}>
                    <TouchableOpacity onPress={() => { router.push('userProfile') }}
                        style={styles.shopprofile}>
                        <Image source={require('../assets/images/iconshop.webp')}
                            style={styles.convertImage} />
                            <View style={styles.nameshopContainer}>
                                <Text style={styles.nameshop}>Hải Nam Computers</Text>
                                <View style={styles.addressContainer}>
                                    <Image source={require('../assets/images/iconaddress.jpg')}
                                        style={styles.iconaddress} />
                                    <Text style={styles.address}>Hà Nội</Text>
                                </View>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setfollow(!follow) }}
                        style={styles.follow}>
                        {follow ? (<Text>Theo dõi</Text>) : (<Text>Đang theo dõi</Text>)}
                    </TouchableOpacity>
                </View>
                <View style={styles.informationcontainer}>
                    <View style={styles.productContainer}>
                        <Text style={styles.quantity}>100</Text>
                        <Text style={styles.product}>Sản phẩm</Text>
                    </View>
                    <View style={styles.evaluatecontainer}>
                        <Text style={styles.proportion}>5.0</Text>
                        <Text style={styles.evaluate}>Đánh giá</Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.description}>MÔ TẢ VỀ SẢN PHẨM</Text>
                    <Text style={styles.content}>Đạp xe cũng là bộ môn dễ tập luyện và phù hợp với hầu hết mọi người, tập luyện tại nhà vừa an toàn vừa tiết kiệm.
                                                - Khi đạp xe, các bộ phận trên cơ thể sẽ hoạt động mạnh mẽ, đặc biệt tác động nhiều nhất vào vùng bụng, hông, đùi. Đạp xe thường xuyên sẽ giúp tăng cường sự tác động tích cực đến mật độ xương, sẽ kích thích cơ bắp ở lưng dưới, từ đó tác động đến các cơ bắp nhỏ của các đốt sống, tăng cường sức khỏe của xương sống.
                                                +Xe đạp thể dục tại nhà, Xe đạp thể thao cao cấp BG Elite
                                                - Khung xe khỏe khoắn Khung xe được làm từ hợp kim thép chắc chắn, chịu tải trọng cao, thiết kế dạng hình tam giác ba điểm giúp tác động lên cơ thể người tập ở nhiều bộ phận khác nhau như vùng mông, vùng eo, vùng bắp tay…. Kích thước nhỏ gọn, có thể di chuyển ở nhiều không gian khác nhau như , phòng khách, phòng ngủ, văn phòng,... Phù hợp cho mọi thành viên trong gia đình.</Text>
                </View>
            </ScrollView>
        </ScreenWrapper>
     );
}

export default ProductDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',

    },

    carousel: {
        width: '100%',
        height: auto,
        backgroundColor: 'white',
        alignItems: 'center', 
        justifyContent: 'center',
    },

    nameproduct: {
        padding: 10,
        fontSize: 14,
        fontWeight: 'bold',

    },


    pricelove: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: 18,
        color: "#9C9C9C",
        fontWeight: 'bold',
        marginLeft: 10,
    },
    likeContainer:{
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 34,
        width: 34,
        alignItems: 'center',
        borderRadius: 20,
        marginRight: 10,
    },


    informationshop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        alignItems: 'center', 
    },
    convertImage: {
        width: 50,
        height: 50,
        borderRadius: 20,
        marginVertical: 3,
        marginLeft: 5,
        marginTop: 5,
    },

    shopprofile:{
        flexDirection: 'row',
    },

    nameshopContainer:{
        flexDirection: 'column',
    },
    nameshop: {
        top: 5,
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    iconaddress: {
        width: 13,
        height: 15,
        borderRadius: 20,
        marginVertical: 3,
        marginLeft: 8,
        top: 8,
    },
    addressContainer:{
        flexDirection: 'row',
    },
    address: {
        top: 10,
        fontSize: 12,
        color: "#9C9C9C",
        marginLeft: 10,
    },

    informationcontainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 5,
        width: '60%',
        height:auto,
    },
    productContainer: {
        flexDirection: 'row',
    },
    quantity: {
        fontSize: 15,
        color: "#EE0000",
    },
    product: {
        left: 5,
        fontSize: 15,
    },
    evaluatecontainer: {
        flexDirection: 'row',
    },
    proportion: {
        fontSize: 15,
        color: "#EE0000",
    },
    evaluate: {
        left: 5,
        fontSize: 15,
    },
    follow:{
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        height: 34,
        width: 100,
        alignItems: 'center',
        borderRadius: 20,
    },


    description: {
        padding: 5,
        fontSize: 20,
        fontWeight: 'bold',
    },

    content: {
        padding: 10,
        fontStyle: 'italic',
        fontSize: 15,
    },
})