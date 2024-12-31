import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import usePagination from '../../hooks/usePagination';
import { useScrollStore } from '../../store/useScrollStore';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.5,
  useShadowColorFromDataset: false,
  decimalPlaces: 0,
};

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { products, isLoading: productsLoading, error: productsError, onEndReached: fetchMoreProducts } = usePagination();
  const { users, isLoading: usersLoading, error: usersError, fetchUsers, fetchMoreUsers } = usePagination();
  const [refreshing, setRefreshing] = useState(false);
  const scrollViewRef = useRef(null);
  const setScrollPosition = useScrollStore((state) => state.setScrollPosition);
  const getScrollPosition = useScrollStore((state) => state.getScrollPosition);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load previous scroll position
  useEffect(() => {
    const savedPosition = getScrollPosition('Analytics');
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: savedPosition, animated: false });
    }
  }, []);

  const handleScroll = (event) => {
    const currentScrollPosition = event.nativeEvent.contentOffset.y;
    setScrollPosition('Analytics', currentScrollPosition);
  };

  const calculateAvgPrice = (items = []) => {
    const validPrices = items.filter((item) => item?.price && !isNaN(item.price));
    return validPrices.reduce((sum, item) => sum + item.price, 0) / validPrices.length || 0;
  };

  const calculateReputationScore = (items = []) => {
    const validScores = items.filter((item) => item?.reputation_score && !isNaN(item.reputation_score));
    return validScores.reduce((sum, item) => sum + item.reputation_score, 0) / validScores.length || 0;
  };

  const getPriceRanges = (items = []) => {
    return items.reduce(
      (acc, item) => {
        if (item?.price && !isNaN(item.price)) {
          if (item.price < 20000) acc.low++;
          else if (item.price < 35000) acc.medium++;
          else acc.high++;
        }
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );
  };

  const getReputationRanges = (items = []) => {
    return items.reduce(
      (acc, item) => {
        if (item?.reputation_score && !isNaN(item.reputation_score)) {
          if (item.reputation_score < 50) acc.low++;
          else if (item.reputation_score < 80) acc.medium++;
          else acc.high++;
        }
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );
  };

  const getGenderStats = (items = []) => {
    return items.reduce(
      (acc, item) => {
        if (item?.gender != null) {
          item.gender ? acc.male++ : acc.female++;
        }
        return acc;
      },
      { male: 0, female: 0 }
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'products') {
        await fetchMoreProducts(1, true);
      } else {
        await fetchUsers(1, true);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to refresh data.');
    } finally {
      setRefreshing(false);
    }
  };

  const ProductAnalytics = () => {
    if (productsLoading || !products) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingContainer} />;
    }

    if (productsError) {
      return <Text style={styles.errorText}>{productsError}</Text>;
    }

    const priceRanges = getPriceRanges(products || []);
    const avgPrice = calculateAvgPrice(products || []);

    const priceData = [
      { name: '< 20k', population: priceRanges.low, color: '#FF6384', legendFontColor: '#7F7F7F' },
      { name: '20k-35k', population: priceRanges.medium, color: '#36A2EB', legendFontColor: '#7F7F7F' },
      { name: '> 35k', population: priceRanges.high, color: '#FFCE56', legendFontColor: '#7F7F7F' },
    ];

    return (
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Products</Text>
            <Text style={styles.statValue}>{(products || []).length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Avg Price</Text>
            <Text style={styles.statValue}>{avgPrice.toLocaleString()}đ</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Price Distribution</Text>
          <PieChart
            data={priceData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[0, 0]}
          />
        </View>
      </ScrollView>
    );
  };

  const UserAnalytics = () => {
    if (usersLoading || !users) {
      return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingContainer} />;
    }

    if (usersError) {
      return <Text style={styles.errorText}>{usersError}</Text>;
    }

    if (users.length === 0) {
      return <Text style={styles.noDataText}>No user data available</Text>;
    }

    const reputationRanges = getReputationRanges(users);
    const genderStats = getGenderStats(users);
    const avgReputation = calculateReputationScore(users);

    const reputationData = [
      {
        name: 'Low',
        population: reputationRanges.low,
        color: '#FF6384',
        legendFontColor: '#7F7F7F',
      },
      {
        name: 'Medium',
        population: reputationRanges.medium,
        color: '#36A2EB',
        legendFontColor: '#7F7F7F',
      },
      {
        name: 'High',
        population: reputationRanges.high,
        color: '#FFCE56',
        legendFontColor: '#7F7F7F',
      },
    ];

    const genderData = {
      labels: ['Male', 'Female'],
      datasets: [
        {
          data: [genderStats.male, genderStats.female],
          colors: ['#36A2EB', '#FF6384'],
        },
      ],
    };

    return (
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          if (!layoutMeasurement || !contentOffset || !contentSize) return;

          const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          if (isEndReached) {
            fetchMoreUsers();
          }
        }}
        scrollEventThrottle={400}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Total Users</Text>
            <Text style={styles.statValue}>{users.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statTitle}>Avg Reputation</Text>
            <Text style={styles.statValue}>{avgReputation.toFixed(1)}</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Reputation Distribution</Text>
          <PieChart
            data={reputationData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            center={[0, 0]}
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Gender Distribution</Text>
          <BarChart
            data={genderData}
            width={width - 40}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
        </View>

        {loadingMore && <ActivityIndicator size="small" color="#0000ff" style={styles.loadingMore} />}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'products' && styles.activeTab]}
          onPress={() => setActiveTab('products')}
        >
          <Text style={[styles.tabText, activeTab === 'products' && styles.activeTabText]}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'products' ? <ProductAnalytics /> : <UserAnalytics />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(4),
    marginVertical: hp(2),
  },
  tab: {
    flex: 1,
    paddingVertical: hp(1.5),
    alignItems: 'center',
    borderRadius: theme.radius.lg,
    backgroundColor: theme.colors.gray100,
    marginHorizontal: wp(1),
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: hp(1.8),
    color: theme.colors.text,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: wp(4),
    gap: wp(4),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp(4),
    borderRadius: theme.radius.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  statTitle: {
    fontSize: hp(1.6),
    color: theme.colors.text,
    marginBottom: hp(1),
  },
  statValue: {
    fontSize: hp(2.4),
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  chartContainer: {
    marginHorizontal: wp(4),
    marginBottom: hp(4),
    padding: wp(4),
    backgroundColor: '#fff',
    borderRadius: theme.radius.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  chartTitle: {
    fontSize: hp(2),
    fontWeight: 'bold',
    marginBottom: hp(2),
    color: theme.colors.text,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: hp(2),
    color: theme.colors.text,
    marginTop: hp(4),
  },
  errorText: {
    textAlign: 'center',
    fontSize: hp(2),
    color: 'red',
    marginTop: hp(4),
    paddingHorizontal: wp(4),
  },
  loadingMore: {
    marginVertical: hp(2),
  },
});

export default Analytics;
