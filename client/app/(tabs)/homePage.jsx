import { View, Text, StyleSheet, StatusBar, Pressable, FlatList, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import { theme } from '../../constants/theme'
import Icon from '../../assets/icons'
import Search from '../../components/Search'
import Carousel from '../../components/Carousel'
import ProductCard from '../../components/ProductCard'



const homePage = () => {
    const [selectedId, setSelectedId] = useState();
    const nameRef = React.useRef('');
    const [isLiked, setIsLiked] = useState(false)
    const DATA = [
        {
            id: '1',
            title: 'All',
        },
        {
            id: '2',
            title: 'Second Item',
        },
        {
            id: '3',
            title: 'Third Item',
        },
        {
            id: '4',
            title: 'Third Item',
        },
        {
            id: '5',
            title: 'Third Item',
        },
        {
            id: '6',
            title: 'Third Item',
        },
    ];


    const Item = ({ item, onPress, backgroundColor, textColor }) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, { backgroundColor }]}>
            <Text style={[styles.title, { color: textColor }]}>{item.title}</Text>
        </TouchableOpacity>
    );
    const ItemSeparator = () => <View style={styles.separator} />;
    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? '#04FFB8' : '#F4F6F8';
        const color = item.id === selectedId ? 'white' : theme.colors.text;
        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                backgroundColor={backgroundColor}
                textColor={color}
            />
        );
    }
    return (
        <ScreenWrapper bg={'white'}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.logoText}>Eco Trade</Text>
                    <View style={styles.icons}>
                        <Pressable>
                            <Icon name={'cart'} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable>
                            <Icon name={'heart'} size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                    </View>
                </View>
                {/* Search */}
                <View style={styles.row}>
                    <Search
                        icon={<Icon name="search" size={26} strokeWidth={1.6} />}
                        placeholder="Search products, brands..."
                        onChangeText={value => nameRef.current = value}
                    />

                    <Icon name="filter" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />

                </View>
                {/* Categories */}


                {/* Carousel */}
                {/* <View>
                    <SafeAreaView>
                        <Carousel />
                    </SafeAreaView>
                </View> */}

                {/* Products */}
                <FlatList
                    numColumns={2}
                    ListHeaderComponent={
                        <>
                            <View>
                                <FlatList
                                    data={DATA}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.id}
                                    extraData={selectedId}
                                    horizontal={true}
                                    ItemSeparatorComponent={ItemSeparator}
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        </>
                    }
                    data={[1, 2, 3, 4, 5, 6, 7, 8]}
                    renderItem={({ item, index }) =>
                        <ProductCard item={item} isLiked={isLiked} setIsLiked={setIsLiked} />}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 300 }}
                />
                <View style={{ flexDirection: 'row' }}>
                    <ProductCard />
                    <ProductCard />
                </View>

                {/* Footer */}







            </View>
        </ScreenWrapper>
    )
}

export default homePage

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        paddingHorizontal: wp(4)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 50,
        marginHorizontal: wp(4),
        paddingTop: hp(2)
    },
    logoText: {
        fontSize: hp(3),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,

    },
    icons: {
        flexDirection: 'row',
        gap: 18,
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    item: {
        height: hp(8),
        width: wp(27),
        justifyContent: 'center',
        alignItems: 'center',
        borderCurve: 'continuous',
        borderRadius: theme.radius.xl,
    },
    title: {
        color: theme.colors.text,
        fontSize: hp(2),
        fontWeight: theme.fonts.semibold
    },
    separator: {
        marginLeft: 7,
    }

})