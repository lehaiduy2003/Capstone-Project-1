import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../../components/ScreenWrapper';

const SIDEBAR_WIDTH = 250;
const windowWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState('');

  // Animation value for sidebar
  const [slideAnim] = useState(new Animated.Value(-SIDEBAR_WIDTH));

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarOpen(!isSidebarOpen);
  };

  const handleMenuSelect = (menuItem) => {
    setSelectedMenu(menuItem.id);
    router.push(menuItem.route);
    toggleSidebar();
  };

  const menuItems = [
    {
      id: 'account',
      title: 'Customer Management',
      route: '(dashboard)/CustomerManagement',
      icon: 'person-outline',
    },
    {
      id: 'product',
      title: 'Product Management',
      route: '(dashboard)/ProductManagement',
      icon: 'cube-outline',
    },
    {
      id: 'orders',
      title: 'Order Management',
      route: '/dashboard/order-management',
      icon: 'cart-outline',
    },
    {
      id: 'analytics',
      title: 'Analytics',
      route: '(dashboard)/Analytics',
      icon: 'bar-chart-outline',
    },
  ];

  return (
    //<ScreenWrapper>
    <SafeAreaView style={styles.container}>
      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Dashboard</Text>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                selectedMenu === item.id && styles.selectedMenuItem,
              ]}
              onPress={() => handleMenuSelect(item)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={selectedMenu === item.id ? '#fff' : '#333'}
              />
              <Text
                style={[
                  styles.menuText,
                  selectedMenu === item.id && styles.selectedMenuText,
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={toggleSidebar}
        >
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <Text style={styles.welcomeText}>Welcome to Dashboard</Text>
          <Text style={styles.subtitleText}>
            Select an option from the menu to get started
          </Text>
        </View>
      </View>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      )}
    </SafeAreaView>
    // </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#f8f9fa',
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  menuContainer: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedMenuItem: {
    backgroundColor: '#00C26F',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  selectedMenuText: {
    color: '#fff',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    padding: 15,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
});

export default DashboardScreen;