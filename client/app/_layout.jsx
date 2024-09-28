import React from 'react';
import { Stack, Tabs } from 'expo-router';


const _layout = () => {

    return <Stack screenOptions={{
        headerShown: false
    }}>

        <Stack.Screen name="welcome" options={{ headerTitle: false }} />
        {/* <Stack.Screen name="HomePage/homePage" options={{ headerTitle: false }} /> */}

        {/* <Tabs>
            <Tabs.Screen name="index" options={{ title: "Home" }} />
        </Tabs> */}


    </Stack>


};

export default _layout;


