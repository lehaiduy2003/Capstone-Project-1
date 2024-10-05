import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Import FontAwesome icons
import { theme } from '../../constants/theme';
import { hp } from '../../helpers/common';

const OtherFeature = () => {
  const handlePress = (feature) => {
    Alert.alert('Feature Clicked', `You clicked: ${feature}`);
    
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tiện ích khác</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('Khách hàng thân thiết')}>
          <FontAwesome name="user" size={24} style={styles.icon} />
          <Text style={styles.buttonText}>Khách hàng thân thiết</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('Mua lại')}>
          <FontAwesome name="shopping-cart" size={24}  style={styles.icon} />
          <Text style={styles.buttonText}>Mua lại</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('Kênh người sáng tạo')}>
          <FontAwesome name="pencil" size={hp(2)}  style={styles.icon} />
          <Text style={styles.buttonText}>Kênh người sáng tạo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('Số dư TK Shopee')}>
          <FontAwesome name="pencil" size={hp(2)}  style={styles.icon} />
          <Text style={styles.buttonText}>Số dư TK</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('Săn Thưởng Shopee')}>
          <FontAwesome name="gift" size={hp(2)}  style={styles.icon} />
          <Text style={styles.buttonText}>Quà Tặng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handlePress('Shopee Tiếp Thị Liên Kết')}>
          <FontAwesome name="share" size={hp(2)}  style={styles.icon} />
          <Text style={styles.buttonText}>Liên Kết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: hp(2),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    marginRight: 8,
    color: theme.colors.primary,   
    
  },
  buttonText: {
    fontSize: 12,
  },
});

export default OtherFeature;