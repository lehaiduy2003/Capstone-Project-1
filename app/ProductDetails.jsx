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

const ProductDetails = () => {
    const [isLiked, setIsLiked] = React.useState(false)
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
                    <Text style={styles.price}>10$</Text>
                    <TouchableOpacity onPress={() => { setIsLiked(!isLiked) }}
                         style={styles.likeContainer}>
                        {isLiked ? (<ArtDesign name='heart' size={20} color={"#E55B5B"} />) : (<ArtDesign name='hearto' size={20} color={"#E55B5B"} />)}
                    </TouchableOpacity>
                </View>
                <View style={styles.information}>
                    <Image source={require('../assets/images/iconshop.webp')}
                    style={styles.convertImage} />
                    <Text style={styles.nameshop}>Hải Nam Computers</Text>
                    <Button style={styles.Viewshop}
                        title='follow'
                        buttonStyle={{ marginHorizontal: wp(3) }}
                        onPress={() => { router.push('shop') }}
                    />
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
        padding: 5,
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


    information: {
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
    nameshop: {
        padding: 10,
        fontSize: 15,
        fontWeight: 'bold',
        right: 15,
        top: -10,
    },

    Viewshop: {
        backgroundColor: 'white',
        justifyContent: 'center',
        height: 34,
        width: 100,
        alignItems: 'center',
        borderRadius: 2,
        marginRight: 10,
    },

    description: {
        padding: 10,
        fontSize: 20,
        fontWeight: 'bold',
    },

    content: {
        padding: 10,
        fontStyle: 'italic',
        fontSize: 15,
    },
})