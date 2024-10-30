import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const orders = [
  { id: '1', name: 'Regular Fit Slogan', size: 'M', price: 1190, status: 'In Transit' },
  { id: '2', name: 'Regular Fit Polo', size: 'L', price: 1100, status: 'Picked' },
  { id: '3', name: 'Regular Fit Black', size: 'L', price: 1690, status: 'In Transit' },
];

const OrderItem = ({ item }) => (
  <View style={styles.orderContainer}>
    <View style={styles.orderInfo}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>Size {item.size}</Text>
      <Text style={styles.itemPrice}>${item.price}</Text>
    </View>
    <Text style={[styles.status, item.status === 'Picked' ? styles.picked : styles.inTransit]}>
      {item.status}
    </Text>
    <TouchableOpacity style={styles.trackButton}>
      <Text style={styles.trackButtonText}>Track Order</Text>
    </TouchableOpacity>
  </View>
);

const MyOrdersScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Orders</Text>
      </View>
      <View style={styles.tabContainer}>
        <Text style={[styles.tab, styles.activeTab]}>Ongoing</Text>
        <Text style={styles.tab}>Completed</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  tab: {
    fontSize: 16,
    paddingHorizontal: 20,
    color: '#888',
  },
  activeTab: {
    color: '#000',
    fontWeight: 'bold',
  },
  orderContainer: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  picked: {
    backgroundColor: '#FFE5B4',
    color: '#FF8C00',
  },
  inTransit: {
    backgroundColor: '#E0F7FA',
    color: '#00796B',
  },
  trackButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MyOrdersScreen;
