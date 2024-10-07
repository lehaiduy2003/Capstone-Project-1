import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React from "react";
  import { theme } from "../../constants/theme";
  import { hp, wp } from "../../helpers/common";
  import Icon from "../../assets/icons";
  import { useNavigation } from '@react-navigation/native';
  

  const HeaderAcc = () => {

    const handleClick = (label) => {
      console.log(`Clicked: ${label}`);
      navigation.navigate('Login');
    };

    {/* Hàm xử lý đăng xuất */}
    const confirmLogout = () => {
      Alert.alert(
        'Xác nhận đăng xuất',
        'Bạn có chắc chắn muốn đăng xuất không?',
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Đăng xuất',
            onPress: () => handleLogout(), // Gọi hàm đăng xuất khi người dùng chọn "Đăng xuất"
          },
        ],
        { cancelable: false } // Không cho phép đóng hộp thoại bằng cách chạm ra ngoài
      );
    };

    return (
      <View style={styles.container} >
        {/* Phần trái header */}
        <View style={styles.leftHeader}>
          <TouchableOpacity  onPress={() => handleClick('Change Avatar')}>
            <Icon
              style={{ marginLeft: wp(1) }}
              name="user"
              size={hp(6)}
              strokeWidth={2}
              color='white'
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.userName}>User Name</Text>
            <Text style={styles.textSimple}>Điểm uy tín - Lượt mua</Text>
          </View>
        </View>
        {/* Phần phải header */}
        <View style={styles.rightHeader}>
          <TouchableOpacity  onPress={() => handleClick('mail')}>
            <Icon
              name="mail"
              size={hp(4)}
              strokeWidth={2}
              color='white'
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={confirmLogout}>
            <Icon
              name="logout"
              size={hp(4)}
              strokeWidth={2}
              color='white'
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

export default HeaderAcc
const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between', 
      alignItems: 'center',
      paddingHorizontal: wp(4),
      paddingTop: hp(3),
      backgroundColor: theme.colors.primary,
    },
      leftHeader: {
        
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2, // Chiếm 2 phần của header
      },
      rightHeader: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 1, // Chiếm 1 phần của header
      },
      userName: {
        fontSize: hp(2.2),
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: wp(2),
      },
      textSimple: {
        fontSize: hp(1.4),
        color: '#fff',
        marginLeft: wp(2),
      },
      userInfo: {
        marginHorizontal: wp(2),
      },
    });
