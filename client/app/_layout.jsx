import React from 'react';
import { Stack } from 'expo-router';

const _layout = () => {
    return <Stack screenOptions={{
        headerShown: false
    }}>
        {/*nếu gặp trường hợp loading không vào được thì thay name="login" sau đó đổi lại name="welcome" */}
        <Stack.Screen name="welcome" options={{ headerTitle: false }} />
    </Stack>


};

export default _layout;


