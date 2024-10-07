import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { theme } from '../../constants/theme';  
import { hp, wp } from '../../helpers/common';
const OrderMenu = () => {

  // Handle the click of each icon
  const handleClick = (label) => {
    console.log(`Clicked: ${label}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đơn mua</Text>
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconItem} onPress={() => handleClick('Chờ xác nhận')}>
          <FontAwesome name="file" size={hp(3)} color={theme.colors.dark} />
          <Text style={styles.iconLabel}>Chờ xác nhận</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconItem} onPress={() => handleClick('Chờ lấy hàng')}>
          <FontAwesome name="archive" size={hp(3)} color={theme.colors.dark} />
          <Text style={styles.iconLabel}>Chờ lấy hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconItem} onPress={() => handleClick('Chờ giao hàng')}>
          <FontAwesome name="truck" size={hp(3)} color={theme.colors.dark} />
          <Text style={styles.iconLabel}>Chờ giao hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconItem} onPress={() => handleClick('Đánh giá')}>
          <FontAwesome name="star" size={hp(3)} color={theme.colors.dark}  />
          <Text style={styles.iconLabel}>Đánh giá</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.historyButton} onPress={() => handleClick('Xem lịch sử mua hàng')}>
        <Text style={styles.historyButtonText}>Xem lịch sử mua hàng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: hp(2),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconItem: {
    alignItems: 'center',
    
  },
  iconLabel: {
    marginTop: 10,
    fontSize: 12,
    textAlign: 'center',
  },
  historyButton: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  historyButtonText: {
    color: theme.colors.primary ,
    fontSize: 14,
  },
});

export default OrderMenu;