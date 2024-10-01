import React from 'react';
import { Stack, Tabs } from 'expo-router';


const _layout = () => {

    return <Stack screenOptions={{
        headerShown: false
    }}>

        <Stack.Screen name="account" options={{ headerTitle: false }} />
        {/* <Stack.Screen name="HomePage/homePage" options={{ headerTitle: false }} /> */}


    </Stack>


};

export default _layout;


