import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
    return <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="welcome" options={{ headerTitle: false }} />
    </Stack>


};

export default _layout;


